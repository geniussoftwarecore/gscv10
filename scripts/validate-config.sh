#!/bin/bash

# GSC Configuration Validation Script
# Validates Docker Compose files and environment configurations

set -e

echo "🔍 Validating GSC Configuration Files..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Validation functions
validate_yaml() {
    local file=$1
    if command -v docker-compose &> /dev/null; then
        if docker-compose -f "$file" config --quiet; then
            echo -e "${GREEN}✅ $file syntax is valid${NC}"
        else
            echo -e "${RED}❌ $file has syntax errors${NC}"
            return 1
        fi
    else
        # Fallback to basic YAML validation if available
        if command -v python3 &> /dev/null; then
            python3 -c "import yaml; yaml.safe_load(open('$file'))" 2>/dev/null
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✅ $file YAML syntax is valid${NC}"
            else
                echo -e "${RED}❌ $file has YAML syntax errors${NC}"
                return 1
            fi
        else
            echo -e "${YELLOW}⚠️  Cannot validate $file (no docker-compose or python3)${NC}"
        fi
    fi
}

validate_env_example() {
    local file=".env.example"
    if [ -f "$file" ]; then
        # Check for required variables
        local required_vars=(
            "NODE_ENV"
            "PORT"
            "DATABASE_URL"
            "JWT_SECRET"
            "CORS_ORIGIN"
        )
        
        local missing_vars=()
        for var in "${required_vars[@]}"; do
            if ! grep -q "^${var}=" "$file"; then
                missing_vars+=("$var")
            fi
        done
        
        if [ ${#missing_vars[@]} -eq 0 ]; then
            echo -e "${GREEN}✅ $file has all required variables${NC}"
        else
            echo -e "${RED}❌ $file is missing variables: ${missing_vars[*]}${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
        return 1
    fi
}

validate_dockerfile() {
    local file=$1
    if [ -f "$file" ]; then
        # Basic Dockerfile validation
        if grep -q "FROM" "$file" && grep -q "WORKDIR" "$file"; then
            echo -e "${GREEN}✅ $file structure looks valid${NC}"
        else
            echo -e "${RED}❌ $file is missing required directives${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
        return 1
    fi
}

validate_github_workflow() {
    local file=".github/workflows/ci.yml"
    if [ -f "$file" ]; then
        # Check for required workflow components
        if grep -q "jobs:" "$file" && grep -q "runs-on:" "$file"; then
            echo -e "${GREEN}✅ $file structure looks valid${NC}"
        else
            echo -e "${RED}❌ $file is missing required GitHub Actions structure${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ $file not found${NC}"
        return 1
    fi
}

# Run validations
echo "📋 Validating Docker Compose files..."
validate_yaml "docker-compose.staging.yml"
validate_yaml "docker-compose.prod.yml"

echo
echo "📋 Validating Dockerfiles..."
validate_dockerfile "Dockerfile"
validate_dockerfile "Dockerfile.client"

echo
echo "📋 Validating environment configuration..."
validate_env_example

echo
echo "📋 Validating GitHub workflows..."
validate_github_workflow

echo
echo "📋 Validating project structure..."

# Check for essential files
essential_files=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "drizzle.config.ts"
    ".dockerignore"
    "nginx/default.conf"
    "scripts/backup.sh"
    ".github/release.md"
)

missing_files=()
for file in "${essential_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All essential files are present${NC}"
else
    echo -e "${RED}❌ Missing files: ${missing_files[*]}${NC}"
fi

echo
echo "🎉 Configuration validation complete!"

# Check if any validations failed
if [ ${#missing_files[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some validations failed. Please fix the issues above.${NC}"
    exit 1
fi