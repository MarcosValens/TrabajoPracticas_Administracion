pipeline {
  environment {
    COMMITTER_EMAIL = sh (
    script: 'git --no-pager show -s --format=\'%ae\'',
    returnStdout: true
    ).trim()
  }
  agent any
  stages {
    stage('Prepare enviroment') {
      steps {
        sh  '''
            echo "preparamos enviroment"
            npm install
            '''
      }
    }
    stage('Testing') {
        when {
            not {
                branch 'produccion'
            }
        }
        steps {
            sh  '''
                echo "Hacemos testing"
                npm run test
                '''
        }
    }
    stage('Compile') {
        when {
            anyOf {
                branch 'desarrollo';
                branch 'produccion'
            }
        }
        steps {
            sh  '''
                echo "Hacemos el package"
                npm run build
                '''
        }
    }
    stage('Build docker image') {
      when{
        branch 'produccion'
      }
      steps {
        sh  '''
            echo "Contruimos la imagen docker"
            cp -r ./dist/spa ./spa
            docker build -t imagen-administracio .
            '''
        cleanWs()
      }
    }

    stage('Upload image to registry'){
        when{
            branch 'produccion'
        }
        steps  {
            sh  '''
                echo "Subimos la imagen docker creada"
                docker tag  imagen-administracio  registry-back.esliceu.com/imagen-administracio
                docker push  registry-back.esliceu.com/imagen-administracio
                '''
            cleanWs()
        }
    }

    stage('Deploying on produccion'){
        when{
            branch 'produccion'
        }
        steps  {
        sh  '''
            echo "desplegamos"
            ssh deploy.esliceu.com "cd core_i_menjador; docker-compose stop; docker-compose pull; docker-compose up -d"
            '''
        cleanWs()
        }
    }
  }
  post {
    success {
      slackSend channel: '#jenkins-builds',  color: 'good', message: "The pipeline ${currentBuild.fullDisplayName} completed successfully from ${env.COMMITTER_EMAIL}. You can check it on ${env.BUILD_URL}."
    }
      failure {
        slackSend channel: '#jenkins-builds', color: '#ff0000', message: "The pipeline ${currentBuild.fullDisplayName} failed from ${env.COMMITTER_EMAIL}. You can check it on ${env.BUILD_URL}."
      }
  }
}
