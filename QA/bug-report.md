Bug Report



Project: React E-Commerce Website



* Testing Date: 25 June 2026
* Bug ID: ROUTE-001



Title: Router package configuration needs verification



File: src/components/ProtectedRoute.jsx



Severity: Medium



Description:

The project uses `react-router` and imports `Navigate` from it. Routing configuration should be verified to ensure redirects work correctly.



Steps to Reproduce:



1\. Login as a user.

2\. Access a protected page.

3\. Logout.

4\. Try accessing the protected page again.



Expected Result:

User should be redirected to the login page.



Actual Result:

To be verified during testing.



Status:

Open



Recommendation:

Verify router configuration and protected route behavior.



