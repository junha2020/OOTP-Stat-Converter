# 1단계: 빌드 환경 (JDK 17 Alpine)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Gradle 래퍼 및 설정 파일 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# gradlew 실행 권한 부여 및 JAR 빌드 (테스트 제외)
RUN chmod +x ./gradlew
RUN ./gradlew build -x test --no-daemon

# 2단계: 실행 환경 (JRE 17 Alpine - 경량화)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드 단계에서 생성된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 8080 포트 노출 및 앱 실행
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]