# 1단계: 빌드 환경 (JDK 17 Alpine)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# 프로젝트 전체 복사
COPY . .

# 🔹 [치트키] 윈도우용 줄바꿈(\r) 싹 제거 + gradlew 실행 권한 부여
RUN sed -i 's/\r$//' ./gradlew && chmod +x ./gradlew

# Gradle 빌드 실행 (테스트 제외)
RUN ./gradlew build -x test --no-daemon

# 2단계: 실행 환경 (JRE 17 Alpine)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 8080 포트 노출 및 실행
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]