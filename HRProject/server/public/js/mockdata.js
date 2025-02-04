export const employees = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    department_id: 5,
    status: "Active",
    phone: "123-456-7890",
    address: "123 Main St, Cityville",
    created_date: "2023-01-15T10:30:00Z",
    last_updated_date: "2023-01-20T15:45:00Z",
    user_id: 1,
  },
  {
    id: 2,
    first_name: "Jane",
    last_name: "Smith",
    department_id: 6,
    status: "Inactive",
    phone: "987-654-3210",
    address: "456 Elm St, Townsville",
    created_date: "2023-02-01T08:00:00Z",
    last_updated_date: "2023-02-10T12:00:00Z",
    user_id: 102,
  },
];

export const users =[{
 id:1,
  username:"john_doe",
  password:"john_doe",
  role:"user",
  created_date: "2023-02-01T08:00:00Z",
    last_updated_date: "2023-02-10T12:00:00Z"
}
]

export const tasks = [
  {
    id: 1,
    task_name: "Task 1",
    task_description: "Description of Task 1",
    task_group_id: 3,
    auto_start: true,
    created_date: "2023-01-15T10:30:00Z",
    last_updated_date: "2023-01-20T15:45:00Z",
  },
  {
    id: 2,
    task_name: "Task 2",
    task_description: "Description of Task 2",
    task_group: 3,
    auto_start: false,
    created_date: "2023-02-01T08:00:00Z",
    last_updated_date: "2023-02-10T12:00:00Z",
  },
];

export const subtasks = [
  {
    id: 1,
    task_id: 1,
    subtask_name: "Subtask 1",
    subtask_description: "Review project requirements and outline key tasks.",
    document_id: 201,
    device_type_id: 1,
    training_module_id: 1,
    interview_id: 1,
    survey_id: 1,
    created_date: "2025-01-01T10:00:00Z",
    last_updated_date: "2025-01-10T14:30:00Z",
    enable: true,
  },
  {
    id: 2,
    task_id: 1,
    subtask_name: "Subtask 2",
    subtask_description: "Review project requirements and outline key tasks.",
    document_id: 202,
    device_type_id: 2,
    training_module_id: 0,
    interview_id: 0,
    survey_id: 0,
    created_date: "2025-01-01T10:00:00Z",
    last_updated_date: "2025-01-10T14:30:00Z",
    enable: true,
  },
  {
    id: 3,
    task_id: 1,
    subtask_name: "Subtask 3",
    subtask_description: "Review project requirements and outline key tasks.",
    document_id: 201,
    device_type_id: 1,
    training_module_id: 0,
    interview_id: 0,
    survey_id: 0,
    created_date: "2025-01-01T10:00:00Z",
    last_updated_date: "2025-01-10T14:30:00Z",
    enable: true,
  },
];

// export const documents = [
//   {
//     id: 1,
//     document_name: "Employee Handbook",
//     document_path: "/documents/employee-handbook.pdf",
//     create_date: "2025-01-01T10:00:00Z",
//     last_updated_date: "2025-01-10T12:00:00Z",
//     enabled: true,
//     documentscol: "Internal Use",
//   },
//   {
//     id: 201,
//     document_name: "Code of Conduct",
//     document_path: "/documents/code-of-conduct.pdf",
//     create_date: "2025-01-05T10:00:00Z",
//     last_updated_date: "2025-01-15T12:00:00Z",
//     enabled: true,
//     documentscol: "External Use",
//   },
//   {
//     id: 203,
//     document_name: "HR Policies",
//     document_path: "/documents/hr-policies.pdf",
//     create_date: "2025-01-10T10:00:00Z",
//     last_updated_date: "2025-01-20T12:00:00Z",
//     enabled: false,
//     documentscol: "Internal Use",
//   },
// ];

export const equiptments = [
  {
    id: 1,
    device_name: "Dell D34",
    device_code: "123XD44",
    device_type: "Laptop",
    enabled: false,
    occupied_by: 3,
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 1,
    device_name: "Dell D3334",
    device_code: "123XD44",
    device_type: "Monitor",
    enabled: true,
    occupied_by: 0,
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

export const training_modules = [
  {
    id: 1,
    training_name: "Portal Training",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 2,
    training_name: "Position Training",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

export const interviews = [
  {
    id: 1,
    interview_name: "Exit Interview",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

export const surveys = [
  {
    id: 1,
    survey_name: "Employee Survey",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];
export const object_type = [
  {
    id: 1,
    object: "Equiptment",
    object_type: "Laptop",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 2,
    object: "Equiptment",
    object_type: "Monitor",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 3,
    object: "TaskGroup",
    object_type: "Onboard",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 4,
    object: "TaskGroup",
    object_type: "Offboard",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 5,
    object: "Department",
    object_type: "HR",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 6,
    object: "Department",
    object_type: "IT",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
  {
    id: 7,
    object: "Department",
    object_type: "Employee",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

export const user_task_head = [
  {
    id: 1,
    user_id: 1,
    task_id: 1,
    task_status: "Processing",
    process_rate: 0,
    start_date: "2025-01-10T10:00:00Z",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

export const user_task_detail = [
  {
    id: 1,
    head_id:1,
    subtask_id:1,
    task_status: "Pending",
    document_id:1,
    doucment_upload_path:"",
    device_type_id:1,
    device_id:3,
    training_module_id:1,
    training_by:"",
    interview_id:0,
    interview_by:0,
    survey_id:0,
    start_date: "",
    create_date: "2025-01-10T10:00:00Z",
    last_updated_date: "2025-01-20T12:00:00Z",
  },
];

