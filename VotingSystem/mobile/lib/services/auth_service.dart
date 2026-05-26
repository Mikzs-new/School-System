import 'package:dio/dio.dart';

import '../api/api_client.dart';
import '../models/user_model.dart';

class AuthService {
  static Future<UserModel> login({
    required String username,
    required String password,
  }) async {
    try {
      final response =
          await ApiClient.dio.post(
        '/auth/login/',
        data: {
          'username': username,
          'password': password,
        },
      );

      return UserModel.fromJson(
        response.data,
      );
    } on DioException catch (e) {
      if (e.response != null) {
        throw Exception(
          e.response?.data['detail'] ??
              'Login failed',
        );
      }

      throw Exception(
        'Network error',
      );
    }
  }
}