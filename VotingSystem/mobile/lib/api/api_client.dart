import 'package:dio/dio.dart';

import '../services/storage_service.dart';
import '../utils/constants.dart';

class ApiClient {
  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: AppConstants.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    ),
  )
    ..interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token =
              await StorageService.getToken();

          if (token != null) {
            options.headers['Authorization'] =
                'Bearer $token';
          }

          handler.next(options);
        },
      ),
    );
}