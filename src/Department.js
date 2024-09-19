import React, { Component } from 'react';
import { Table, Button, ButtonToolbar } from 'react-bootstrap';
import { AddDepModal } from './AddDepModal';

export class department extends Component {
    constructor(props) {
        super(props);
        this.state = { deps: [], addModalShow: false, editModalShow: false };

        // Binding the addModalClose function to this component instance
        this.addModalClose = this.addModalClose.bind(this);
    }

    refreshList() {
        fetch(process.env.REACT_APP_API + 'department')
            .then(response => {
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers.get('Content-Type'));

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                if (response.headers.get('Content-Type')?.includes('text/html')) {
                    throw new Error('Received HTML instead of JSON');
                }

                return response.json();
            })
            .then(data => {
                console.log('Data received:', data);
                this.setState({ deps: data });
            })
            .catch(error => {
                console.error('Fetch error:', error.message);
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    // Define the function to handle modal close
    addModalClose() {
        this.setState({ addModalShow: false });
    }

    render() {
        const { deps } = this.state;
        return (
            <div>
                <Table className="mt-4" striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th>DepartmentId</th>
                        <th>DepartmentName</th>
                        <th>Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {deps.map(dep => (
                        <tr key={dep.departmentId}>
                            <td>{dep.departmentId}</td>
                            <td>{dep.departmentName}</td>
                            <td>
                                <ButtonToolbar>
                                    <Button className="mr-2" variant="info"
                                            onClick={() => this.setState({ editModalShow: true, depid: dep.departmentId, depname: dep.departmentName })}>
                                        Edit
                                    </Button>

                                    <Button className="mr-2" variant="danger"
                                            onClick={() => this.deleteDep(dep.departmentId)}>
                                        Delete
                                    </Button>
                                </ButtonToolbar>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <ButtonToolbar>
                    <Button variant='primary'
                            onClick={() => this.setState({ addModalShow: true })}>
                        Add Department
                    </Button>

                    <AddDepModal show={this.state.addModalShow}
                                 onHide={this.addModalClose} />
                </ButtonToolbar>
            </div>
        );
    }
}
