# Azure Deployment Guide for Library Management System

This guide will help you deploy the Library Management System to Azure with Azure SQL Database.

## Prerequisites

- Azure account with active subscription
- Azure CLI installed (optional, for command-line deployment)
- Git repository (for CI/CD deployment)

## Step 1: Create Azure SQL Database

### Using Azure Portal

1. **Navigate to Azure Portal** (https://portal.azure.com)

2. **Create SQL Database**:
   - Click "Create a resource"
   - Search for "SQL Database"
   - Click "Create"

3. **Configure Database**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Database Name**: `library_management_db`
   - **Server**: Create new server
     - **Server name**: `your-library-server` (must be globally unique)
     - **Location**: Choose closest region
     - **Authentication**: SQL authentication
     - **Server admin login**: Choose username (e.g., `libraryadmin`)
     - **Password**: Create strong password
   - **Compute + Storage**: 
     - Select "Basic" or "Standard" tier for development
     - For production, choose appropriate tier based on needs

4. **Networking**:
   - **Connectivity method**: Public endpoint
   - **Firewall rules**: 
     - ✅ Allow Azure services and resources to access this server
     - Add your current IP address for local development

5. **Review + Create**: Click to create the database

6. **Note Your Connection Details**:
   ```
   Server: your-library-server.database.windows.net
   Database: library_management_db
   Username: libraryadmin
   Password: [your password]
   ```

## Step 2: Configure Local Environment

1. **Copy Environment Template**:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` File**:
   ```env
   AZURE_SQL_SERVER=your-library-server.database.windows.net
   AZURE_SQL_DATABASE=library_management_db
   AZURE_SQL_USERNAME=libraryadmin
   AZURE_SQL_PASSWORD=your-secure-password
   SERVER_PORT=8080
   SPRING_PROFILES_ACTIVE=dev
   ```

3. **Test Local Connection**:
   ```bash
   mvn spring-boot:run
   ```

   If successful, you should see:
   - "Started LibraryManagementApplication"
   - No database connection errors
   - Application running on http://localhost:8080

## Step 3: Create Azure App Service

### Using Azure Portal

1. **Create Web App**:
   - Click "Create a resource"
   - Search for "Web App"
   - Click "Create"

2. **Configure Web App**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Use same as database
   - **Name**: `library-management-app` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Java 17
   - **Java web server stack**: Java SE (Embedded Web Server)
   - **Operating System**: Linux
   - **Region**: Same as database
   - **Pricing Plan**: 
     - Development: B1 (Basic)
     - Production: P1V2 or higher

3. **Review + Create**: Click to create

## Step 4: Configure App Service Environment Variables

1. **Navigate to Your App Service** in Azure Portal

2. **Go to Configuration** (under Settings)

3. **Add Application Settings**:
   Click "New application setting" for each:

   | Name | Value |
   |------|-------|
   | `AZURE_SQL_SERVER` | `your-library-server.database.windows.net` |
   | `AZURE_SQL_DATABASE` | `library_management_db` |
   | `AZURE_SQL_USERNAME` | `libraryadmin` |
   | `AZURE_SQL_PASSWORD` | `your-secure-password` |
   | `SPRING_PROFILES_ACTIVE` | `azure` |
   | `SERVER_PORT` | `8080` |

4. **Save Configuration**

## Step 5: Deploy Application

### Option A: Manual Deployment (Maven)

1. **Build the Application**:
   ```bash
   mvn clean package -DskipTests
   ```

2. **Deploy to Azure**:
   ```bash
   az login
   az webapp deploy --resource-group <resource-group-name> \
                    --name library-management-app \
                    --src-path target/library-management-1.0.0.jar \
                    --type jar
   ```

### Option B: GitHub Actions (Recommended)

1. **Get Publish Profile**:
   - In Azure Portal, go to your App Service
   - Click "Get publish profile"
   - Download the file

2. **Add GitHub Secret**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Value: Paste entire contents of publish profile file

3. **Push Code**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

   GitHub Actions will automatically build and deploy your application.

### Option C: Azure CLI with ZIP Deploy

1. **Build JAR**:
   ```bash
   mvn clean package -DskipTests
   ```

2. **Deploy**:
   ```bash
   az webapp deployment source config-zip \
     --resource-group <resource-group-name> \
     --name library-management-app \
     --src target/library-management-1.0.0.jar
   ```

## Step 6: Verify Deployment

1. **Access Your Application**:
   - URL: `https://library-management-app.azurewebsites.net`
   - It may take 2-3 minutes for first startup

2. **Check Application Logs**:
   ```bash
   az webapp log tail --resource-group <resource-group-name> \
                      --name library-management-app
   ```

3. **Test Endpoints**:
   - Dashboard: `https://library-management-app.azurewebsites.net/`
   - API Health: `https://library-management-app.azurewebsites.net/api/books`

## Step 7: Database Initialization

The application will automatically create tables on first run using Hibernate's `ddl-auto=update` setting.

To verify:
1. Connect to Azure SQL Database using Azure Data Studio or SQL Server Management Studio
2. Check that tables are created: `books`, `members`, `transactions`

## Troubleshooting

### Connection Timeout
- **Issue**: Cannot connect to database
- **Solution**: 
  - Check firewall rules in Azure SQL Database
  - Add App Service outbound IP addresses to SQL firewall

### Application Won't Start
- **Issue**: Application fails to start
- **Solution**:
  - Check application logs: `az webapp log tail`
  - Verify environment variables are set correctly
  - Ensure Java 17 runtime is selected

### CORS Errors
- **Issue**: Frontend cannot access API
- **Solution**: 
  - CORS is already configured in `LibraryManagementApplication.java`
  - If using custom domain, update CORS configuration

## Production Checklist

- [ ] Change `spring.jpa.hibernate.ddl-auto` to `validate` in production
- [ ] Enable HTTPS only in App Service
- [ ] Set up Application Insights for monitoring
- [ ] Configure auto-scaling rules
- [ ] Set up backup for Azure SQL Database
- [ ] Implement authentication/authorization
- [ ] Use Azure Key Vault for secrets
- [ ] Configure custom domain (optional)
- [ ] Set up staging slot for zero-downtime deployments

## Cost Optimization

**Development Environment**:
- SQL Database: Basic tier (~$5/month)
- App Service: B1 Basic (~$13/month)
- **Total**: ~$18/month

**Production Environment**:
- SQL Database: Standard S1 (~$30/month)
- App Service: P1V2 (~$73/month)
- **Total**: ~$103/month

## Security Best Practices

1. **Use Azure Key Vault** for storing database credentials
2. **Enable SSL/TLS** for database connections (already configured)
3. **Implement authentication** using Azure AD or Spring Security
4. **Regular backups** of Azure SQL Database
5. **Monitor logs** using Application Insights
6. **Use managed identities** instead of connection strings when possible

## Support

For issues or questions:
- Azure Documentation: https://docs.microsoft.com/azure
- Spring Boot on Azure: https://docs.microsoft.com/azure/developer/java/spring-framework/

## Next Steps

1. Add sample data for testing
2. Implement user authentication
3. Set up monitoring and alerts
4. Configure backup strategy
5. Optimize database indexes for performance
