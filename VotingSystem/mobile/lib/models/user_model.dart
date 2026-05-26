class UserModel {
  final String access;
  final String refresh;
  final String role;

  UserModel({
    required this.access,
    required this.refresh,
    required this.role,
  });

  factory UserModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return UserModel(
      access: json['access'],
      refresh: json['refresh'],
      role: json['role'],
    );
  }
}