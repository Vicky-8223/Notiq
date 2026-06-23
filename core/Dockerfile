FROM eclipse-temurin:21-jre

WORKDIR /app

COPY build/libs/core-0.0.1-SNAPSHOT.jar app.jar
COPY kafka-truststore.jks kafka-truststore.jks

EXPOSE 8080

ENV JAVA_TOOL_OPTIONS="-Duser.timezone=Asia/Kolkata"

ENTRYPOINT ["java","-jar","app.jar"]