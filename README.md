# Log Ingestor and Query Interface

### Description: 
This Flask application provides a log management system that allows ingest logs in large amount with high speed  which can be scall-up and scall-down.

### Summary of Solution: 
Idea is to develope cloud base enterprice appliction so that we can use this application huge volume of data In order to make application enterprice we need to do following: 
- Setup load balancer which will recieve traffic from variaous source and distribute traffic to all the app instancein.
- Make micro service for ingest and search logs ideally there should two different micro service one for insert log and search log in NoSQL DB.
- Deploye application either by K8 cluster which will manage scanlling up and scale down of POD or Create EC2 Instance which autoscal-up feature.
- Use RDBMS(PostgreSQL) for relation data and for storing log use NoSQL databse , ideal RDBMS is oracle DB However we used PostgreSQL due short of oracle licence.
- Use NoSQL DB to store logs which provided greate flexibility in term of data sharding , replication, speed. 



## Features Implemented

- **HTTP Log Ingestion**: Logs are ingested into the system via HTTP POST requests.
- **Batch Insertion**: Supports batch insertion of log entries for efficient handling of high volumes.
- **Scalability Consideration**: Implemented indexing in MongoDB to optimize query performance and handling of large log volumes.
- **Error Handling**: Provides error handling during log insertion to manage potential issues gracefully.
- **Full-text Search**: Supports full-text search for logs using various fields like `level`, `message`, `resourceId`, etc.
- **Field Filters**: Allows filtering logs based on `level`, `message`, `resourceId`, `timestamp`, `traceId`, `spanId`, `commit`, `metadata.parentResourceId`.
- **Date Range Filter**: Implements filtering logs between specified timestamp ranges.
- **Efficient Query Handling**: Optimizes log search by leveraging MongoDB's indexing capabilities.
- **Regular Expression Search**: Utilizes regular expressions for more complex and flexible search queries within log data.
- **Date Range Filtering**: Implements filtering logs within specific date ranges.
- **Error Handling**: Provides error messages in case of invalid data or server errors during log ingestion or search.


## Please follow following instruction to install application in localhost
## System Design
### Please have look on following architecture diagram to undertand application

![Local Image](./Logging%20system.png)

## Backend Setup

### Prerequisites

- Python 3.x installed
- PostgreSQL installed and running

### Installation

1. Clone the repository.

2. Install required Python packages:

    ```bash
    pip install flask flask_cors pymongo psycopg2 werkzeug
    ```

3. Set up MongoDB:
   
   - Create a MongoDB Atlas account (or use an existing one).
   - Create the Cluster name Cluster0.
   - Once the cluster is set up, go to the cluster's overview in MongoDB Atlas.
   - Click on "Connect" and select "Connect to your application".
   - Copy the connection string URI provided.
   - Replace `<your_mongodb_uri>` in `main.py` with your MongoDB connection URI or use the existing one.
        ```python
            uri = "your_mongodb_connection_uri_here"
            client = MongoClient(uri)
            db = client['your_database_name_here']
            logs_collection = db['logs']
        ```
   
4. Set up PostgreSQL:

   - Install and configure PostgreSQL.
   - setup databse
        ```sql
        CREATE DATABASE log;
        ```
   - Update the PostgreSQL connection settings in `main.py` under `postgres_conn` to match your setup.
        ```python
            postgres_conn = {
                'dbname': 'log',
                'user': 'your_username',
                'password': 'your_password',
                'host': 'localhost'
            }
        ```

5. Run the Flask application:

    ```bash
    python app.py
    ```

The application will be running on `http://localhost:3000/`.


## Frontend Setup

### Prerequisites

- Node.js installed
- Backend server running

1. **Install Dependencies:**
go to the frontend folder and run this command

    ```bash
    npm install
    ```

2. **Run the Server:**

    ```bash
    npm run dev
    ```
  The application will be running on `http://localhost:5173/`.



# Cloud Setup

In order to make enterprice application deploy application in cloud 
Summary of cloud setup : 
- Create load balancer 
- Deploye application (micro service) in ec2 instance and setup autoscal-up

Challenges faced : While installing SSL/TLS certificate so that application can be connect from internet  

## VPC Setup

1. **Create VPC**
   - Provide a name for the VPC.
   - Define the CIDR block (IP range).
   - Click "Create VPC".

## Internet Gateway

1. **Create Internet Gateway**
   - Specify a new internet gateway name.
   - Click on "Create Internet Gateway".

2. **Attach Internet Gateway to VPC**
   - Go to the Internet Gateway Actions section.
   - Click on "Attach to VPC".
   - Select the desired VPC.
   - Click "Attach Internet Gateway".

## Subnet Configuration

1. **Create Subnets**
   - Click on "Create Subnet".
   - Choose the VPC.
   - Enter a subnet name.
   - Define the subnet CIDR block IP ranges.
   - Repeat the process for additional subnets.
   - Click "Create Subnet".

## Route Tables

1. **Create Route Table**
   - Give it a name.
   - Select the associated VPC.
   - Click "Create Route Table".

2. **Associate Subnets and Set Routes**
   - Go to Subnet Associations.
   - Click on "Edit Subnet" and attach the subnets created earlier.
   - Click "Save Association".
   - In the route section, click "Edit Route".
   - Add route "0.0.0.0/0".
   - Choose the Internet Gateway from the dropdown.
   - Click "Save Changes".

## Target Group and Load Balancer

1. **Target Group Setup**
   - Click on "Target Group".
   - Create a target group selecting instances as the target type.
   - Name the target group.
   - Select the VPC.
   - Click "Create Target Group".

2. **Load Balancer Configuration**
   - Click on "Load Balancer".
   - Create an application load balancer.
   - Name the load balancer.
   - Select the VPC.
   - Choose both subnets.
   - Select the target group for listener and routing configurations.
   - Create the load balancer.

## Auto Scaling Group

1. **Create Auto Scaling Group**
   - Enter the auto-scaling group name.
   - Create a launch template.
     - Name the template.
     - Choose the AMI.
     - Enable auto assign public IP.
     - Specify the application in the launch template.
   - Select the launch template name.
   - Choose the VPC.
   - Attach it to an existing load balancer.
   - Choose the existing load balancer target group.
   - Enable elastic load balancing health checks.
   - Specify desired, minimum, and maximum capacity.
   - Click "Create Auto Scaling".

## Testing

Test the application to ensure proper functionality and scalability.
