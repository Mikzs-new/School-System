class ElectionModel {
  final int id;
  final String title;

  ElectionModel({
    required this.id,
    required this.title,
  });

  factory ElectionModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return ElectionModel(
      id: json['id'],
      title:
          json['title'] ??
          json['name'] ??
          'Untitled Election',
    );
  }
}