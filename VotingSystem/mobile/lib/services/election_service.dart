import '../api/api_client.dart';
import '../models/election_model.dart';

class ElectionService {
  static Future<List<ElectionModel>>
      getElections() async {

    final response =
        await ApiClient.dio.get(
      '/election/elections/',
    );

    print(response.data);

    final data = response.data;

    List elections = [];

    if (data is List) {
      elections = data;
    } else if (data is Map &&
        data.containsKey('results')) {
      elections = data['results'];
    }

    return elections
        .map(
          (e) => ElectionModel.fromJson(e),
        )
        .toList();
  }
}