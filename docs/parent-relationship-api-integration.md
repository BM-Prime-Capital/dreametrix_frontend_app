# Parent-Student Relationship API Integration

## ✅ Backend Endpoints Integrated

### 1. Get Linked Students
```
GET /parents/parent/linked-students/
```

**Response Format:**
```json
[
  {
    "relation_id": 4,
    "student_id": 8,
    "student_user_id": 12,
    "student_full_name": "Jordan Nguepi"
  }
]
```

**TypeScript Interface:**
```typescript
interface LinkedStudent {
  relation_id: number
  student_id: number
  student_user_id: number
  student_full_name: string
}
```

### 2. Get Pending Student Links
```
GET /parents/parent/pending-student-links/
```

**Response Format:**
```json
[
  {
    "relation_id": 14,
    "student_id": 1,
    "student_user_id": 4,
    "student_full_name": "Jonas Mohamed Moube",
    "requested_at": null
  }
]
```

**TypeScript Interface:**
```typescript
interface LinkRequest {
  relation_id: number
  student_id: number
  student_user_id: number
  student_full_name: string
  requested_at: string | null
}
```

---

## 🔧 Service Implementation

### ParentRelationshipService.ts

The service has been fully implemented and tested with the real backend endpoints:

```typescript
class ParentRelationshipServiceClass {
  // Get all linked students
  async getLinkedStudents(accessToken: string): Promise<LinkedStudentsResponse>

  // Get all pending link requests
  async listRequestLinks(accessToken: string): Promise<ListRequestLinksResponse>

  // Request to link a new student (TODO: Backend endpoint needed)
  async requestLink(studentCode: string, accessToken: string): Promise<RequestLinkResponse>

  // Cancel a pending request (TODO: Backend endpoint needed)
  async cancelRequestLink(requestId: number, accessToken: string): Promise<CancelRequestResponse>

  // Helper methods
  async hasLinkedStudents(accessToken: string): Promise<boolean>
  async hasPendingRequests(accessToken: string): Promise<boolean>
  async getRelationshipStatus(accessToken: string): Promise<RelationshipStatus>
}
```

---

## 🔄 API Integration Status

### ✅ Implemented & Working
- **GET /parents/parent/linked-students/** - Fully integrated
- **GET /parents/parent/pending-student-links/** - Fully integrated

### ⏳ Pending Backend Implementation
The following endpoints are referenced in the frontend but need backend implementation:

1. **POST /parent/relationship/request-link**
   ```json
   Request Body:
   {
     "student_code": "STU12345678"
   }

   Response:
   {
     "message": "Link request submitted successfully",
     "request_id": 123,
     "status": "pending"
   }
   ```

2. **DELETE /parent/relationship/cancel-request/{requestId}**
   ```json
   Response:
   {
     "message": "Link request cancelled successfully",
     "request_id": 123
   }
   ```

---

## 📊 Data Flow

### User Flow: Parent Links Student

```
1. Parent logs in → Layout checks relationship status
2. No students found → EmptyParentState shown
3. Parent clicks "Link Student" → /parent/link-student
4. Parent enters student code → Form validation
5. Form submits → POST /parent/relationship/request-link
6. Success → Shows pending state
7. Admin approves → Student appears in linked list
```

### Hook Integration

The `useParentRelationship` hook manages all relationship data:

```typescript
const {
  linkedStudents,        // Array of LinkedStudent
  linkRequests,          // Array of LinkRequest (pending)
  loading,               // boolean
  error,                 // string | null
  hasLinkedStudents,     // boolean
  hasPendingRequests,    // boolean
  linkedStudentsCount,   // number
  pendingRequestsCount,  // number
  requestLink,           // (code: string) => Promise<void>
  cancelRequest,         // (id: number) => Promise<void>
  refreshData            // () => Promise<void>
} = useParentRelationship(accessToken)
```

---

## 🐛 Issues Fixed

### 1. TypeScript Errors Resolved
- ✅ Fixed import of non-existent `ParentAdminApiClient`
- ✅ Updated to use direct `fetch` calls with `BACKEND_BASE_URL`
- ✅ Updated interfaces to match real backend response format
- ✅ Fixed all property access errors (total_students → linked_students.length)
- ✅ Removed unused imports in layout.tsx

### 2. API Response Structure Updated
**Before (Imagined):**
```typescript
{
  students: LinkedStudent[],
  total_students: number
}
```

**After (Real Backend):**
```typescript
LinkedStudent[]  // Direct array response
```

### 3. Hook Computed Values Fixed
**Before:**
```typescript
const hasPendingRequests = linkRequests.filter(req => req.status === "pending").length > 0
```

**After:**
```typescript
const hasPendingRequests = linkRequests.length > 0
// All requests are pending by design
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Layout correctly detects linked students
- [ ] Empty state shows when no students linked
- [ ] Pending state shows when requests exist
- [ ] Link student form validates correctly
- [ ] API calls include correct authentication headers
- [ ] Error messages display properly
- [ ] Loading states work correctly

### API Integration Tests
- [x] GET /parents/parent/linked-students/ returns correct format
- [x] GET /parents/parent/pending-student-links/ returns correct format
- [ ] POST /parent/relationship/request-link (needs backend)
- [ ] DELETE /parent/relationship/cancel-request/:id (needs backend)

---

## 📝 Backend Requirements

### New Endpoints Needed

#### 1. Request Student Link
```python
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_student_link(request):
    """
    Allow parent to request link with student using student code
    """
    student_code = request.data.get('student_code')

    # Validate student code exists
    # Create pending relationship request
    # Notify school admin for approval

    return Response({
        'message': 'Link request submitted successfully',
        'request_id': relation.id,
        'status': 'pending'
    })
```

#### 2. Cancel Link Request
```python
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_link_request(request, request_id):
    """
    Allow parent to cancel a pending link request
    """
    # Find request by ID
    # Verify request belongs to authenticated parent
    # Delete or mark as cancelled

    return Response({
        'message': 'Link request cancelled successfully',
        'request_id': request_id
    })
```

---

## 🚀 Deployment Notes

1. **Environment Variables**: Ensure `BACKEND_BASE_URL` is set correctly
2. **Authentication**: All endpoints require Bearer token in Authorization header
3. **CORS**: Backend must allow requests from frontend domain
4. **Error Handling**: Frontend expects standard HTTP status codes (200, 400, 401, 500)

---

## 📈 Future Enhancements

1. **Real-time Updates**: Use WebSocket for instant notification when link is approved
2. **Bulk Linking**: Allow parent to link multiple students at once
3. **Link History**: Show all approved/rejected requests with reasons
4. **Notifications**: Email/SMS when request is approved/rejected
5. **Student Verification**: Optional 2FA verification from student side

---

**Last Updated**: 2025-01-07
**Status**: Phases 1-2 Complete, Backend Integration Pending
**Next**: Implement missing backend endpoints
