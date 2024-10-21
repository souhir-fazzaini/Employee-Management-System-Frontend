import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

export class AddDepModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentName: '',
        };
    }

    handleChange = (event) => {
        this.setState({ departmentName: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const newDepartment = {
            departmentName: this.state.departmentName
        };

        fetch(process.env.REACT_APP_API + 'Department', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDepartment)
        })
            .then(response => response.json())
            .then(data => {
                this.props.onAddDepartment(data); // Assurez-vous que cette prop est passée et utilisée
                this.props.onHide();
                this.resetForm(); // Réinitialiser le formulaire après ajout

            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout du département:', error.message);
            });
    }
    // Méthode pour réinitialiser le formulaire
    resetForm() {
        this.setState({ departmentName: '' });
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
