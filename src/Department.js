import React, { Component } from 'react';
import { Table, Button, ButtonToolbar, Alert } from 'react-bootstrap';
import { AddDepModal } from './AddDepModal';
import { EditDepModal } from './EditDepModal';

export class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deps: [],
            addModalShow: false,
            editModalShow: false,
            depid: null,
            depname: '',
            successMessage: '', // State for success message
        };

        // Binding methods
        this.addModalClose = this.addModalClose.bind(this);
        this.handleAddDepartment = this.handleAddDepartment.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handleUpdateDepartment = this.handleUpdateDepartment.bind(this);
        this.deleteDep = this.deleteDep.bind(this);
    }

    refreshList() {
        fetch(process.env.REACT_APP_API + 'department')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                this.setState({ deps: data });
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    addModalClose() {
        this.setState({ addModalShow: false });
    }

    handleAddDepartment(newDepartment) {
        console.log('New Department Received:', newDepartment); // Vérifiez les données reçues
        this.setState(prevState => {
            console.log('Previous State:', prevState.deps); // Vérifiez l'état précédent
            return {
                deps: [...prevState.deps, newDepartment],
                successMessage: 'Department added successfully!',
            };
        }, () => {
            console.log('Updated State:', this.state.deps); // Vérifiez l'état mis à jour
        });

        // Clear the success message after 3 seconds
        setTimeout(() => this.setState({ successMessage: '' }), 3000);

        // Close the modal
        this.addModalClose();
    }



    handleUpdateDepartment(updatedDepartment) {
        this.setState(prevState => ({
            deps: prevState.deps.map(dep =>
                dep.departmentId === updatedDepartment.departmentId ? updatedDepartment : dep
            ),
            successMessage: 'Department updated successfully!', // Set success message
        }), () => {
            // Clear the success message after 3 seconds
            setTimeout(() => this.setState({ successMessage: '' }), 3000);
        });
    }

    deleteDep(departmentId) {
        fetch(`${process.env.REACT_APP_API}Department/${departmentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    this.refreshList();
                } else {
                    console.error('Error deleting department');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
            });
    }

    render() {
        const { deps, addModalShow, editModalShow, depid, depname, successMessage } = this.state;

        return (
            <div>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>Department Id</th>
                        <th>Department Name</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deps.map((dep, index) => (
                        <tr key={dep.departmentId || index}>
                            <td>{dep.departmentId}</td>
                            <td>{dep.departmentName}</td>
                            <td>
                                <ButtonToolbar>
                                    <Button
                                        className="mr-2"
                                        variant="info"
                                        onClick={() => this.setState({
                                            editModalShow: true,
                                            depid: dep.departmentId,
                                            depname: dep.departmentName
                                        })}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        className="mr-2"
                                        variant="danger"
                                        onClick={() => this.deleteDep(dep.departmentId)}
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
                    <Button variant='primary' onClick={() => this.setState({addModalShow: true})}>
                        Add Department
                    </Button>
                </ButtonToolbar>

                <AddDepModal
                    show={addModalShow}
                    onHide={this.addModalClose}
                    onAddDepartment={this.handleAddDepartment}
                />

                <EditDepModal
                    show={editModalShow}
                    onHide={() => this.setState({editModalShow: false})}
                    depid={depid}
                    depname={depname}
                    onUpdateDepartment={this.handleUpdateDepartment} // Passage correct de la fonction
                />
            </div>
        );
    }
}
