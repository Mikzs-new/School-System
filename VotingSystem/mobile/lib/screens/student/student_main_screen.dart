import 'package:flutter/material.dart';

import 'dashboard_screen.dart';
import 'elections_screen.dart';
import 'results_screen.dart';
import 'profile_screen.dart';

class StudentMainScreen extends StatefulWidget {
  const StudentMainScreen({
    super.key,
  });

  @override
  State<StudentMainScreen> createState() =>
      _StudentMainScreenState();
}

class _StudentMainScreenState
    extends State<StudentMainScreen> {
  int currentIndex = 0;

  final List<Widget> screens = [
    const DashboardScreen(),
    const ElectionsScreen(),
    const ResultsScreen(),
    const ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: screens[currentIndex],

      bottomNavigationBar:
          NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (
          index,
        ) {
          setState(() {
            currentIndex = index;
          });
        },

        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home),
            label: 'Home',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.how_to_vote,
            ),
            label: 'Elections',
          ),

          NavigationDestination(
            icon: Icon(
              Icons.bar_chart,
            ),
            label: 'Results',
          ),

          NavigationDestination(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}