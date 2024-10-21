import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { Image } from 'react-bootstrap';

export class EditEmpModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            EmployeeId: props.empid || '',
            EmployeeName: props.empname || '',
            Department: props.depname || '',
            photofilename: props.photofilename || '',
            DateOfJoining: props.doj || '',
            deps: [],
        };
        this.handleFileSelected = this.handleFileSelected.bind(this);
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_API + 'department')
            .then(response => response.json())
            .then(data => {
                this.setState({ deps: data });
            });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.empid !== this.props.empid ||
            prevProps.empname !== this.props.empname ||
            prevProps.depname !== this.props.depname ||
            prevProps.photofilename !== this.props.photofilename ||
            prevProps.doj !== this.props.doj) {

            this.setState({
                EmployeeId: this.props.empid || '',
                EmployeeName: this.props.empname || '',
                Department: this.props.depname || '',
                photofilename: this.props.photofilename || '',
                DateOfJoining: this.props.doj || '',
                deps: [],
            });
        }
    }

    handleChange = (event) => {
        console.log(event.target.name);
        console.log(event.target.value);
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const updatedEmployee = {
            EmployeeId: this.state.EmployeeId,
            EmployeeName: this.state.EmployeeName,
            Department: this.state.Department,
            Photofilename: this.state.photofilename,
            DateOfJoining: this.state.DateOfJoining,
        };
        console.log(updatedEmployee);
        fetch(`${process.env.REACT_APP_API}Employee/${this.state.EmployeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEmployee),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Network response was not ok: ${response.status} ${text}`);
                    });
                }
                return response.json();
            })
            .then(() => {
                this.props.onUpdateEmployee(updatedEmployee);
                this.props.onHide();
            })
            .catch(error => {
                console.error('Error while updating employee:', error.message);
            });
    };

    handleFileSelected(event) {
        this.setState({ photofilename: event.target.files[0].name });

        const formData = new FormData();
        formData.append('myFile', event.target.files[0], event.target.files[0].name);

        fetch(process.env.REACT_APP_API + 'Employee/SaveFile', {
            method: 'POST',
            body: formData,
        })
            .then(res => res.json())
            .then(result => {
                this.setState({ photofilename: result });
            })
            .catch(error => {
                alert('Failed to upload file');
                console.error(error);
            });
    }

    render() {
        const { show, onHide } = this.props;
        const { EmployeeId, EmployeeName, Department, photofilename, DateOfJoining, deps } = this.state;

        return (
            <div className="container">
                <Modal show={show}
                       onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Edit Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="EmployeeId">
                                        <Form.Label>Employee ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="EmployeeId"
                                            required
                                            placeholder="Employee ID"
                                            disabled
                                            value={EmployeeId}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="EmployeeName">
                                        <Form.Label>Employee Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="EmployeeName"
                                            required
                                            value={EmployeeName}
                                            placeholder="Employee Name"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="departement">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control
                                            as="select"
                                            name="Departement"
                                            value={Department}
                                            onChange={this.handleChange}
                                        >
                                            {deps.map(dep => (
                                                <option key={dep.departmentId} value={dep.departmentName}>
                                                    {dep.departmentName}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="DateOfJoining">
                                        <Form.Label>Date Of Joining</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="DateOfJoining"
                                            required
                                            placeholder="Date Of Joining"
                                            value={DateOfJoining}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Update Employee
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" src={process.env.REACT_APP_PHOTOPATH + photofilename} />
                                <input onChange={this.handleFileSelected} type="file" />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={onHide}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
