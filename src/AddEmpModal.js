import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

export class AddEmpModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeName: '',
        };
    }

    handleChange = (event) => {
        this.setState({ employeeName: event.target.value });
        console.log(event.target.value);
    };

// Exemple simplifié de code pour AddDepModal
    handleSubmit = () => {
        const newEmployee = {
            // Obtenir les détails du nouveau département depuis le formulaire
            employeeId: this.state.employeeId,
            employeeName: this.state.employeeName
        };

        fetch(process.env.REACT_APP_API + 'Employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEmployee)
        })
            .then(response => response.json())
            .then(data => {
                this.props.onAddEmployee(newEmployee); // Passer les données du département
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du département:', error.message);
            });
    }


    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Add Department
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="departmentName">
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentName"
                                        required
                                        placeholder="Department Name"
                                        value={this.state.departmentName}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        Add Department
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
