import React, { Component } from 'react';
import { Table, Button, ButtonToolbar, Alert } from 'react-bootstrap';
import { AddEmpModal } from './AddEmpModal';
import { EditEmpModal } from './EditEmpModal';
import moment from 'moment';


export class Employee extends Component {
    constructor(props) {
        super(props);
     this.state = {
            emps: [],
            addModalShow: false,
            editModalShow: false,
            selectedEmp: null, // Employee to edit
            successMessage: '', // State for success message
        };

        // Binding methods
        this.addModalClose = this.addModalClose.bind(this);
        this.handleAddEmployee = this.handleAddEmployee.bind(this);
        this.handleEditEmployee = this.handleEditEmployee.bind(this);
        this.handleUpdateEmployee = this.handleUpdateEmployee.bind(this);
        this.refreshList = this.refreshList.bind(this);
    }

    refreshList() {
        fetch(process.env.REACT_APP_API + 'employee')
            .then(response => response.json())
            .then(data => {
                this.setState({ emps: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    addModalClose() {
        this.setState({ addModalShow: false, editModalShow: false, selectedEmp: null });
    }

    handleAddEmployee(employee) {
        this.setState(prevState => ({
            emps: [...prevState.emps, employee],
            successMessage: 'Employee added successfully!',
        }));

        // Clear the success message after 3 seconds
        setTimeout(() => this.setState({ successMessage: '' }), 3000);
    }

    handleEditEmployee(employee) {
        // Set the employee to be edited
        this.setState({
            selectedEmp: employee,
            editModalShow: true
        });
    }

    handleUpdateEmployee(updatedEmployee) {
        this.setState(prevState => ({
            emps: prevState.emps.map(emp =>
                emp.employeeId === updatedEmployee.employeeId ? updatedEmployee : emp
            ),
            successMessage: 'Employee updated successfully!',
        }));

        // Clear the success message after 3 seconds
        setTimeout(() => this.setState({ successMessage: '' }), 3000);

        // Close modal
        this.addModalClose();
    }

    deleteEmp(employeeId) {
        fetch(`${process.env.REACT_APP_API}employee/${employeeId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    this.refreshList(); // Refresh list after deletion
                } else {
                    console.error('Error deleting employee');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
            });
    }

    render() {
        const { addModalShow, editModalShow, emps, selectedEmp, successMessage } = this.state;
        console.log(emps);

        return (
            <div>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>EmployeeId</th>
                        <th>EmployeeName</th>
                        <th>Department</th>
                        <th>DOJ</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {emps.map(emp => (
                        <tr key={emp.employeeId}>
                            <td>{emp.employeeId}</td>
                            <td>{emp.employeeName}</td>
                            <td>{emp.department}</td>
                            <td>{moment(emp.dateOfJoining).format('DD/MM/YYYY')}</td> {/* Utilisation de moment.js */}

                            <td>
                                <ButtonToolbar>
                                    <Button
                                        className="mr-2"
                                        variant="info"
                                        onClick={() => this.handleEditEmployee(emp)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="mr-2"
                                        variant="danger"
                                        onClick={() => this.deleteEmp(emp.employeeId)}
                                    >
                                        Delete
                                    </Button>
                                </ButtonToolbar>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <ButtonToolbar>
                    <Button variant="primary" onClick={() => this.setState({addModalShow: true})}>
                        Add Employee
                    </Button>
                </ButtonToolbar>

                <AddEmpModal
                    show={addModalShow}
                    onHide={this.addModalClose}
                    onAddEmployee={this.handleAddEmployee}
                />

                {this.state.selectedEmp && (
                    <EditEmpModal
                        show={editModalShow}
                        onHide={this.addModalClose}
                        empid={this.state.selectedEmp.employeeId}
                        empname={this.state.selectedEmp.employeeName}
                        depname={this.state.selectedEmp.department}
                        photofilename={this.state.selectedEmp.photoFileame}
                        doj={this.state.selectedEmp.DateOfJoining}
                        onUpdateEmployee={this.handleUpdateEmployee}
                    />
                )}
            </div>

        );
    }
}
