pipeline {
    agent { label "WinNode" }
    
    environment {
        GIT_URL = "https://github.com/jaturongsutta/kawasaki-backend.git"
        DEPLOY_PATH = "D:\\WebDeployment\\KAWASAKI_Backend\\"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean Workspace
                cleanWs()
                 
                // Checkout the repository
                script {
                    git branch: 'develop', 
                        url: GIT_URL
                    
                    // Retrieve last commit info
                    def cmd = 'git log -1 --pretty="Last Commit: %%cd , Message : %%s" --date=iso'
                    
                    def commitMessage = bat(script: cmd, returnStdout: true).trim()
                    // Parse the commit message to remove unnecessary parts
                    def parsedMessage = commitMessage.substring(commitMessage.indexOf('>') + cmd.length()).trim()
                    
                    parsedMessage = parsedMessage.replace("'", "") 
                    // Save the last commit info to an environment variable
                    env.LAST_COMMIT = parsedMessage 
                } 
            }
        }
        stage('Install Dependencies') {
            steps {
                // change nodejs version
                bat 'nvm list'
                bat 'nvm use 22.2.0'
                bat 'node -v '
                
                // Install dependencies using pnpm
                bat 'npm install --prefer-offline'
            }
        } 
        stage('Build') {
            steps {
                // Build the project using pnpm
                bat 'npm run build'
                
                bat '''
                @echo off
                    (
                        echo ENV=production
                        echo APP_PORT=84
                        echo DB_HOST=172.20.91.109
                        echo DB_PORT=1433
                        echo DB_USERNAME=sa
                        echo DB_PASSWORD=P@ssw0rd
                        echo DB_NAME=KAWASAKI_DB
                        echo ENV_DEVELOP_DIR=D:\\ApplicationFile\\Log\\KAWASAKI
                        echo GIT_COMMIT_LOG=%LAST_COMMIT%
                    ) >> dist\\.env
                '''
            }
         
        }
        
        stage('Deploy') {
            steps {
                // Delete old deployment and copy new version
                bat ''' echo %DEPLOY_PATH%  '''
                
                
                bat ''' 
                    @echo off
                    echo Cleaning deployment directory except 'kmt-backend-service.exe' and 'kmt-backend-service.xml'...
                    set "TARGET_DIR=%DEPLOY_PATH%"
        
                    rem Delete all files except specified ones
                    for %%F in ("%TARGET_DIR%\\*") do (
                        set "FILENAME=%%~nxF"
                        call :deleteFileIfNotExcluded
                    )
        
                    rem Delete all folders
                    for /D %%D in ("%TARGET_DIR%\\*") do (
                        rmdir /S /Q "%%D"
                    )
        
                    goto :eof
        
                    :deleteFileIfNotExcluded
                    if /I "%FILENAME%"=="kmt-backend-service.exe" goto :eof
                    if /I "%FILENAME%"=="kmt-backend-service.xml" goto :eof
                    del /F /Q "%TARGET_DIR%\\%FILENAME%"
                    goto :eof
                '''
                
                
                /* rmdir /S /Q %DEPLOY_PATH% */
                bat '''
                    @echo on
                    
                    xcopy /s /y /d /r dist\\ %DEPLOY_PATH%
                    xcopy /y /d /r package.json %DEPLOY_PATH%
                    xcopy /y /d /r package-lock.json %DEPLOY_PATH%
                '''
   
                bat ''' 
                    @echo off
                    d:
                    cd %DEPLOY_PATH% 
                    npm install --prefer-offline
                '''
                

            }
        }
        stage('Restart Service') {
            steps {
                
                bat '''
                    sc stop kawasaki-backend
    
                    waitfor neverhappen /T 10
    
                    sc start kawasaki-backend     
                ''' 
            }
         
        }
    }
}
