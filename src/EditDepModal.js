import React, { Component } from 'react';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

export class EditDepModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departmentId: props.depid || '',
            departmentName: props.depname || '',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.depid !== this.props.depid || prevProps.depname !== this.props.depname) {
            this.setState({
                departmentId: this.props.depid || '',
                departmentName: this.props.depname || '',
            });
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };


    handleSubmit = (event) => {
        event.preventDefault();

        const updatedDepartment = {
            departmentId: this.state.departmentId,
            departmentName: this.state.departmentName
        };

        fetch(`${process.env.REACT_APP_API}Department/${this.state.departmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedDepartment)
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
                this.props.onUpdateDepartment(updatedDepartment);
                this.props.onHide();
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour du département:', error.message);
            });
    };

    render() {
        const { show, onHide } = this.props;
        const { departmentId, departmentName } = this.state;

        return (
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Department
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={6}>
                            <Form onSubmit={this.handleSubmit}>
                                <Form.Group controlId="departmentId">
                                    <Form.Label>Department Id</Form.Label>
                                    <Form.Control
                                        disabled
                                        type="number"
                                        name="departmentId"
                                        required
                                        placeholder="Department Id"
                                        value={departmentId}
                                    />
                                </Form.Group>
                                <Form.Group controlId="departmentName">
                                    <Form.Label>Department Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="departmentName"
                                        required
                                        placeholder="Department Name"
                                        value={departmentName}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" type="submit">
                                        Save Changes
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
