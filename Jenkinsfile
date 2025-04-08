pipeline {
    agent { label "WinNode" }
    
    environment {
        GIT_URL = ""
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
                bat 'pnpm install --frozen-lockfile --prefer-offline'
            }
        } 
        stage('Build') {
            steps {
                // Build the project using pnpm
                bat 'pnpm build'
                
                bat '''
                @echo off
                    (
                        echo ENV=production
                        echo APP_PORT=84
                        echo DB_HOST=localhost
                        echo DB_PORT=1433
                        echo DB_USERNAME=sa
                        echo DB_PASSWORD=password
                        echo DB_NAME=BSCB_DB
                        echo ENV_DEVELOP_DIR=.\\application-files\\
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
                    @echo on
                    rmdir /S /Q %DEPLOY_PATH%
                    xcopy /s /y /d /r dist\\ %DEPLOY_PATH%
                    xcopy /y /d /r package.json %DEPLOY_PATH%
                    xcopy /y /d /r pnpm-lock.yaml %DEPLOY_PATH%
                '''
   
                bat ''' 
                    @echo off
                    d:
                    cd %DEPLOY_PATH% 
                    pnpm install --frozen-lockfile --prefer-offline
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
