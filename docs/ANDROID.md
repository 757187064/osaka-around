# Android 构建

完整业务交接见 `AI-HANDOFF.md`。

```sh
npm ci
npm run android:prepare
# JDK17、SDK36、Build Tools36.0.0、Gradle8.13需可用
export JAVA_HOME=/your/jdk17
export ANDROID_HOME=/your/android-sdk
export TRIP_GRADLE=/your/gradle-8.13/bin/gradle
export TRIP_KEYSTORE=/private/japan-trip.jks
export TRIP_KEYSTORE_PASSWORD='your-existing-password'
# 仅私人构建设置；此文件不在公开工程中
export TRIP_PRIVATE_QR=/private/VJW.png
npm run android:build
```

标准版APK不含个人资料；私人版单独包名并内嵌QR。产物在`android/app/build/outputs/apk/{standard,personal}/release/`。
`android/app/src/*/assets/`均为生成文件，已忽略。不要提交QR、签名、SDK、Gradle缓存、APK私人产物。
资源检查：`python3 scripts/verify-android.py --qr /private/VJW.png`。

当前版本1.0.0 / versionCode 1；升级必须递增versionCode且用原签名。
