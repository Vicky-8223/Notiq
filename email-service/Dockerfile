FROM eclipse-temurin:21-jre

WORKDIR /app

COPY build/libs/email-service-0.0.1-SNAPSHOT.jar app.jar
COPY kafka-truststore.jks kafka-truststore.jks

ENV JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Kolkata"

ENTRYPOINT ["java","-jar","app.jar"]