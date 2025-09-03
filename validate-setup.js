#!/usr/bin/env node

/**
 * Environment Validation Script for Dream Badminton
 * Checks if all required environment variables and dependencies are properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🏸 Dream Badminton - Environment Validation\n');

let hasErrors = false;

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✅${colors.reset}`;
}

function cross() {
  return `${colors.red}❌${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠️${colors.reset}`;
}

// Check Node.js version
function checkNodeVersion() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  log(`${colors.bold}1. Node.js Version${colors.reset}`);
  
  if (majorVersion >= 18) {
    log(`   ${checkmark()} Node.js ${nodeVersion} (compatible)`, 'green');
  } else {
    log(`   ${cross()} Node.js ${nodeVersion} (requires 18+)`, 'red');
    log(`   Please update to Node.js 18 or higher`, 'yellow');
    hasErrors = true;
  }
  console.log();
}

// Check if package.json exists
function checkPackageJson() {
  log(`${colors.bold}2. Package Configuration${colors.reset}`);
  
  if (fs.existsSync('package.json')) {
    log(`   ${checkmark()} package.json found`, 'green');
    
    try {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredDeps = [
        'next',
        '@clerk/nextjs', 
        '@prisma/client',
        'tailwindcss',
        'next-themes'
      ];
      
      let missingDeps = [];
      requiredDeps.forEach(dep => {
        if (!pkg.dependencies || !pkg.dependencies[dep]) {
          missingDeps.push(dep);
        }
      });
      
      if (missingDeps.length === 0) {
        log(`   ${checkmark()} All required dependencies present`, 'green');
      } else {
        log(`   ${cross()} Missing dependencies: ${missingDeps.join(', ')}`, 'red');
        hasErrors = true;
      }
      
    } catch (error) {
      log(`   ${cross()} Invalid package.json format`, 'red');
      hasErrors = true;
    }
  } else {
    log(`   ${cross()} package.json not found`, 'red');
    hasErrors = true;
  }
  console.log();
}

// Check node_modules
function checkNodeModules() {
  log(`${colors.bold}3. Dependencies Installation${colors.reset}`);
  
  if (fs.existsSync('node_modules')) {
    log(`   ${checkmark()} node_modules directory exists`, 'green');
  } else {
    log(`   ${cross()} node_modules not found`, 'red');
    log(`   Run: npm install`, 'yellow');
    hasErrors = true;
  }
  console.log();
}

// Check environment variables
function checkEnvironmentVariables() {
  log(`${colors.bold}4. Environment Configuration${colors.reset}`);
  
  if (fs.existsSync('.env')) {
    log(`   ${checkmark()} .env file found`, 'green');
    
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      const requiredVars = [
        'DATABASE_URL',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY'
      ];
      
      let missingVars = [];
      requiredVars.forEach(varName => {
        if (!envContent.includes(varName)) {
          missingVars.push(varName);
        }
      });
      
      if (missingVars.length === 0) {
        log(`   ${checkmark()} All required environment variables present`, 'green');
        
        // Validate Clerk keys format
        if (envContent.includes('pk_test_Y3V0ZS1yYXR0bGVyLTM')) {
          log(`   ${checkmark()} Clerk keys appear valid`, 'green');
        } else {
          log(`   ${warning()} Clerk keys may need verification`, 'yellow');
        }
        
      } else {
        log(`   ${cross()} Missing variables: ${missingVars.join(', ')}`, 'red');
        hasErrors = true;
      }
      
    } catch (error) {
      log(`   ${cross()} Error reading .env file`, 'red');
      hasErrors = true;
    }
  } else {
    log(`   ${cross()} .env file not found`, 'red');
    log(`   Copy from .env.example: cp .env.example .env`, 'yellow');
    hasErrors = true;
  }
  console.log();
}

// Check Prisma setup
function checkPrismaSetup() {
  log(`${colors.bold}5. Database Configuration${colors.reset}`);
  
  if (fs.existsSync('prisma/schema.prisma')) {
    log(`   ${checkmark()} Prisma schema found`, 'green');
    
    if (fs.existsSync('node_modules/.prisma/client')) {
      log(`   ${checkmark()} Prisma client generated`, 'green');
    } else {
      log(`   ${warning()} Prisma client not generated`, 'yellow');
      log(`   Run: npm run db:generate`, 'yellow');
    }
  } else {
    log(`   ${cross()} Prisma schema not found`, 'red');
    hasErrors = true;
  }
  console.log();
}

// Check Tailwind setup
function checkTailwindSetup() {
  log(`${colors.bold}6. Styling Configuration${colors.reset}`);
  
  if (fs.existsSync('tailwind.config.ts')) {
    log(`   ${checkmark()} Tailwind config found`, 'green');
    
    try {
      const config = fs.readFileSync('tailwind.config.ts', 'utf8');
      if (config.includes('darkMode')) {
        log(`   ${checkmark()} Dark mode configured`, 'green');
      } else {
        log(`   ${warning()} Dark mode may not be configured`, 'yellow');
      }
    } catch (error) {
      log(`   ${warning()} Could not validate Tailwind config`, 'yellow');
    }
  } else {
    log(`   ${cross()} Tailwind config not found`, 'red');
    hasErrors = true;
  }
  console.log();
}

// Main validation function
async function validate() {
  log(`${colors.bold}${colors.blue}Starting Environment Validation...${colors.reset}\n`);
  
  checkNodeVersion();
  checkPackageJson();
  checkNodeModules();
  checkEnvironmentVariables();
  checkPrismaSetup();
  checkTailwindSetup();
  
  // Summary
  log(`${colors.bold}📋 Validation Summary${colors.reset}`);
  
  if (hasErrors) {
    log(`${cross()} Some issues found - please fix before proceeding`, 'red');
    console.log('\n💡 Common solutions:');
    log('   • npm install                    (install dependencies)', 'blue');
    log('   • cp .env.example .env          (setup environment)', 'blue');
    log('   • npm run db:generate           (generate Prisma client)', 'blue');
    log('   • Update to Node.js 18+         (if version too old)', 'blue');
    process.exit(1);
  } else {
    log(`${checkmark()} Environment validation passed!`, 'green');
    console.log('\n🚀 Ready to start development:');
    log('   npm run dev', 'blue');
  }
}

// Run validation
validate().catch(error => {
  log(`${cross()} Validation failed: ${error.message}`, 'red');
  process.exit(1);
});