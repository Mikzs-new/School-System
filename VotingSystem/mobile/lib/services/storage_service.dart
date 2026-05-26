import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  static const _storage =
      FlutterSecureStorage();

  static Future<void> saveToken(
    String token,
  ) async {
    await _storage.write(
      key: 'access_token',
      value: token,
    );
  }

  static Future<String?> getToken() async {
    return await _storage.read(
      key: 'access_token',
    );
  }

  static Future<void> saveRole(
    String role,
  ) async {
    await _storage.write(
      key: 'role',
      value: role,
    );
  }

  static Future<String?> getRole() async {
    return await _storage.read(
      key: 'role',
    );
  }

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}