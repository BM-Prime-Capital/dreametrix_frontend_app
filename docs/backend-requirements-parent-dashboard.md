# Backend Requirements: Parent Dashboard API

## Document Version
- **Version**: 1.0
- **Date**: 2025-01-07
- **Status**: Specification for Backend Implementation

---

## Overview

This document specifies the requirements for the Parent Dashboard API endpoint. The frontend is ready and currently using mock data. Once this API is implemented, the frontend will automatically switch to real data.

---

## Endpoint Specification

### **GET /parents/parent/dashboard**

**Description**: Returns comprehensive dashboard data for the authenticated parent, including information about all linked students, their academic performance, attendance, assignments, and aggregated statistics.

**Authentication**: Required (Bearer Token)

**Method**: GET

---

## Request

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Query Parameters
None required. The parent is identified from the JWT token.

---

## Response Format

### Success Response (200 OK)

```json
{
  "parent_info": {
    "id": 1,
    "full_name": "Abraham Nlandu",
    "email": "abraham@example.com",
    "linked_students_count": 2
  },
  "students_summary": [
    {
      "student_id": 8,
      "student_user_id": 12,
      "full_name": "Jordan Nguepi",
      "grade_level": "Grade 5",
      "attendance": {
        "status": "present",
        "attendance_rate": 95.5,
        "present_days": 38,
        "absent_days": 2,
        "late_days": 1
      },
      "academic_performance": {
        "current_average": 87.5,
        "grade_letter": "A-",
        "trending": "up"
      },
      "assignments": {
        "pending_count": 3,
        "completed_count": 12,
        "total_count": 15
      },
      "subjects": [
        {
          "name": "Mathematics",
          "grade": "A-",
          "grade_percentage": 89.0,
          "trending": "up"
        },
        {
          "name": "Science",
          "grade": "B+",
          "grade_percentage": 87.5,
          "trending": "up"
        }
      ],
      "rewards": {
        "total_points": 285,
        "rank": "Gold",
        "recent_achievements": ["Perfect Attendance Week", "Math Champion", "Top Reader"]
      },
      "character": {
        "good_character_count": 32,
        "bad_character_count": 3,
        "character_score": 91.4,
        "trending": "up"
      },
      "classes": {
        "total_classes": 6,
        "active_classes": ["Mathematics", "Science", "English", "History", "Art", "P.E."]
      }
    }
  ],
  "quick_stats": {
    "total_students": 2,
    "all_present_today": true,
    "average_attendance_rate": 93.75,
    "average_grade": 85.0,
    "total_pending_assignments": 5,
    "total_rewards_points": 500,
    "average_character_score": 89.45
  },
  "recent_activity": [
    {
      "type": "grade",
      "student_name": "Jordan",
      "description": "Received A- in Mathematics Quiz",
      "timestamp": "2025-01-07T10:30:00Z"
    },
    {
      "type": "reward",
      "student_name": "Jordan",
      "description": "Earned 'Math Champion' achievement",
      "timestamp": "2025-01-07T09:15:00Z"
    },
    {
      "type": "assignment",
      "student_name": "Alice",
      "description": "Submitted Art Project",
      "timestamp": "2025-01-06T16:45:00Z"
    }
  ]
}
```

---

## Data Structure Details

### **parent_info** (Object)
Parent's basic information.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `id` | Integer | Parent's database ID | Yes |
| `full_name` | String | Parent's full name | Yes |
| `email` | String | Parent's email address | Yes |
| `linked_students_count` | Integer | Total number of linked students | Yes |

---

### **students_summary** (Array of Objects)
Summary of each linked student with key metrics.

#### Student Object

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `student_id` | Integer | Student's database ID | Yes |
| `student_user_id` | Integer | Student's user account ID | Yes |
| `full_name` | String | Student's full name | Yes |
| `grade_level` | String | Student's grade (e.g., "Grade 5") | Yes |
| `attendance` | Object | Attendance information | Yes |
| `academic_performance` | Object | Academic performance summary | Yes |
| `assignments` | Object | Assignments summary | Yes |
| `subjects` | Array | Top 3-5 subjects with grades | Yes |
| `rewards` | Object | Rewards and points information | Yes |
| `character` | Object | Character development data | Yes |
| `classes` | Object | Classes enrollment information | Yes |

#### attendance (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `status` | Enum | Today's status: "present", "absent", "late" | Yes |
| `attendance_rate` | Float | Percentage (0-100) | Yes |
| `present_days` | Integer | Total days present | Yes |
| `absent_days` | Integer | Total days absent | Yes |
| `late_days` | Integer | Total days late | Yes |

#### academic_performance (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `current_average` | Float | Overall average grade percentage (0-100) | Yes |
| `grade_letter` | String | Letter grade (e.g., "A-", "B+") | Yes |
| `trending` | Enum | Trend: "up", "down", "stable" | Yes |

#### assignments (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `pending_count` | Integer | Number of pending assignments | Yes |
| `completed_count` | Integer | Number of completed assignments | Yes |
| `total_count` | Integer | Total assignments | Yes |

#### subjects (Array of Objects)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `name` | String | Subject name | Yes |
| `grade` | String | Letter grade for subject | Yes |
| `grade_percentage` | Float | Percentage grade (0-100) | Yes |
| `trending` | Enum | Trend: "up", "down", "stable" | Yes |

**Note**: Return top 3-5 subjects by enrollment or importance.

---

#### rewards (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `total_points` | Integer | Total rewards points earned | Yes |
| `rank` | String | Rank tier (Bronze/Silver/Gold/Platinum) | Yes |
| `recent_achievements` | Array of Strings | List of recent achievements | Yes |

**Rank Tiers**:
- Bronze: 0-99 points
- Silver: 100-249 points
- Gold: 250-499 points
- Platinum: 500+ points

---

#### character (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `good_character_count` | Integer | Number of good character points | Yes |
| `bad_character_count` | Integer | Number of bad character points | Yes |
| `character_score` | Float | Percentage score (0-100) | Yes |
| `trending` | Enum | Trend: "up", "down", "stable" | Yes |

**Character Score Formula**: `(good_character_count / (good_character_count + bad_character_count)) * 100`

---

#### classes (Object)

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `total_classes` | Integer | Total number of enrolled classes | Yes |
| `active_classes` | Array of Strings | List of active class names | Yes |

---

### **quick_stats** (Object)
Aggregated statistics across all linked students.

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `total_students` | Integer | Total linked students | Yes |
| `all_present_today` | Boolean | True if all students present today | Yes |
| `average_attendance_rate` | Float | Average attendance % across all students | Yes |
| `average_grade` | Float | Average grade % across all students | Yes |
| `total_pending_assignments` | Integer | Sum of pending assignments | Yes |
| `total_rewards_points` | Integer | Sum of rewards points for all students | Yes |
| `average_character_score` | Float | Average character score across all students | Yes |

---

### **recent_activity** (Array)
Recent activity timeline from all subsystems (last 5-10 events).

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `type` | Enum | Activity type: "grade", "assignment", "reward", "character", "attendance" | Yes |
| `student_name` | String | Name of the student | Yes |
| `description` | String | Description of the activity | Yes |
| `timestamp` | String (ISO 8601) | Timestamp of the activity | Yes |

**Note**: Return activities sorted by timestamp (most recent first).

---

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "No linked students found",
  "message": "Please link a student to view dashboard data"
}
```

**Note**: Frontend automatically switches to mock data when 404 is received.

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Business Logic Requirements

### 1. **Attendance Status**
- `status` field should reflect TODAY's attendance status
- Use the most recent attendance record for today
- If no record exists for today, consider status as "absent"

### 2. **Attendance Rate Calculation**
```
attendance_rate = (present_days / (present_days + absent_days + late_days)) * 100
```
- Round to 1 decimal place
- For current academic term/year

### 3. **Grade Trending**
Calculate based on last 30 days of performance:
- **"up"**: Current average > average from 30 days ago (by at least 2%)
- **"down"**: Current average < average from 30 days ago (by at least 2%)
- **"stable"**: Difference is less than 2%

### 4. **Character Score Calculation**
```
character_score = (good_character_count / (good_character_count + bad_character_count)) * 100
```
- Round to 1 decimal place
- For current academic term/year

### 5. **Quick Stats Calculation**

```python
# Example calculations
quick_stats = {
    "total_students": len(students),
    "all_present_today": all(s.attendance.status == "present" for s in students),
    "average_attendance_rate": sum(s.attendance.attendance_rate for s in students) / len(students),
    "average_grade": sum(s.academic_performance.current_average for s in students) / len(students),
    "total_pending_assignments": sum(s.assignments.pending_count for s in students),
    "total_rewards_points": sum(s.rewards.total_points for s in students),
    "average_character_score": sum(s.character.character_score for s in students) / len(students)
}
```

### 6. **Subject Selection**
- Return top 3-5 subjects per student
- Priority order:
  1. Core subjects (Math, Science, English)
  2. Most recent subjects
  3. Subjects with most activity

### 7. **Recent Activity**
- Return last 5-10 events from all subsystems
- Sort by timestamp (most recent first)
- Include events from: grades, assignments, rewards, character, attendance
- Format timestamps as ISO 8601

---

## Data Sources

### Required Database Queries

1. **Parent Information**
   - Table: `users`, `parents`
   - Get authenticated parent's profile

2. **Linked Students**
   - Table: `parent_student_relationships`
   - Filter: `status = 'approved'`

3. **Attendance Data**
   - Table: `attendance_records`
   - Filter by: current academic term/year
   - Include: today's status

4. **Academic Performance**
   - Table: `grades`, `academic_records`
   - Calculate: current average, trending

5. **Assignments**
   - Table: `assignments`, `student_assignments`
   - Filter: assigned to student
   - Count: pending, completed, total

6. **Subject Grades**
   - Table: `subjects`, `student_subjects`, `grades`
   - Get: current grades per subject

7. **Rewards Data**
   - Table: `rewards`, `student_rewards`
   - Calculate: total points, rank tier
   - Get: recent achievements

8. **Character Data**
   - Table: `character_records`
   - Count: good and bad character points
   - Calculate: character score percentage

9. **Classes Data**
   - Table: `classes`, `student_classes`
   - Get: enrolled classes list
   - Count: total active classes

10. **Recent Activity**
    - Tables: Multiple (grades, assignments, rewards, character_records, attendance)
    - Query: Last 5-10 events across all tables
    - Sort: By timestamp descending

---


**Status**: 🟡 Awaiting Backend Implementation
**Frontend Status**: ✅ Complete (Using Mock Data)
