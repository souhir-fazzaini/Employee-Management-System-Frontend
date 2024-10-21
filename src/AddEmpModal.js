import React,{Component} from 'react';
import {Modal,Button, Row, Col, Form,Image} from 'react-bootstrap';

export class AddEmpModal extends Component{
    constructor(props){
        super(props);
        this.state={deps:[]};
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleFileSelected=this.handleFileSelected.bind(this);
    }

    photofilename = "anonymous.png";
    imagesrc = process.env.REACT_APP_PHOTOPATH+this.photofilename;

    componentDidMount(){
        fetch(process.env.REACT_APP_API+'department')
            .then(response=>response.json())
            .then(data=>{
                this.setState({deps:data});
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        // Créer l'objet à envoyer
        const employeeData = {
            EmployeeName: event.target.EmployeeName.value,
            Department: event.target.Department.value,
            DateOfJoining: event.target.DateOfJoining.value,
            PhotoFileName: this.photofilename // Assurez-vous que le nom de la photo est correct
        };

        // Afficher le body dans la console avant d'envoyer la requête
        console.log("Body envoyé à l'API:", JSON.stringify(employeeData));

        // Envoyer la requête à l'API
        fetch(process.env.REACT_APP_API + 'Employee', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then((error) => { throw new Error(error.Message) });
                }
                return res.json();
            })
            .then(result => {

                this.props.onAddEmployee(result);
                this.resetForm();
            })
            .catch(error => {
                alert("Échec : " + error.message);
            });
    }


    resetForm() {
        this.setState({ EmployeeName: '' , });
    }

    handleFileSelected(event){
        event.preventDefault();
        this.photofilename=event.target.files[0].name;
        console.log(this.photofilename);
        const formData = new FormData();
        formData.append(
            "myFile",
            event.target.files[0],
            event.target.files[0].name
        );

        fetch(process.env.REACT_APP_API+'Employee/SaveFile',{
            method:'POST',
            body:formData
        })
            .then(res=>res.json())
            .then((result)=>{
                    this.imagesrc=process.env.REACT_APP_PHOTOPATH+result;
                },
                (error)=>{
                    alert('Failed');
                })

    }

    render(){
        return (
            <div className="container">

                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header clooseButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Employee
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group controlId="EmployeeName">
                                        <Form.Label>EmployeeName</Form.Label>
                                        <Form.Control type="text" name="EmployeeName" required
                                                      placeholder="EmployeeName"/>
                                    </Form.Group>

                                    <Form.Group controlId="Department">
                                        <Form.Label>Department</Form.Label>
                                        <Form.Control as="select">
                                            {this.state.deps.map(dep=>
                                                <option key={dep.departmentId}>{dep.departmentName}</option>)}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="DateOfJoining">
                                        <Form.Label>DateOfJoining</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="DateOfJoining"
                                            required
                                            placeholder="DateOfJoining"
                                        />


                                    </Form.Group>

                                    <Form.Group>
                                        <Button variant="primary" type="submit">
                                            Add Employee
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>

                            <Col sm={6}>
                                <Image width="200px" height="200px" src={this.imagesrc}/>
                                <input onChange={this.handleFileSelected} type="File"/>
                            </Col>
                        </Row>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        )
    }

}
