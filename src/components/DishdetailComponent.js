import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Label,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

function RenderDish({ dish }) {
  return (
    <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
    <Card>
      <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
      <CardBody>
        <CardTitle>{dish.name}</CardTitle>
        <CardText>{dish.description}</CardText>
      </CardBody>
    </Card>
    </FadeTransform>
  );
}

function RenderComments({ comments, dishId, postComment }) {
  let options = { year: "numeric", month: "short", day: "numeric" };
  const l = comments.map((comment) => {
    return (
      <Fade in>
      <div className="container">
        <ul className="list-unstyled" key={comment.id}>
          <li>
            <p>{comment.comment}</p>
            <p>
              -- {comment.author} ,{" "}
              {new Date(comment.date).toLocaleDateString("en-US", options)}
            </p>
          </li>
        </ul>
      </div>
      </Fade>
    );
  });

  return (
    <div>
      <h4>Comments</h4>
      {l}
      <CommentForm dishId={dishId} postComment={postComment}/>
    </div>
  );
}

const DishDetail = (props) => {
  if (props.isLoading){
    return(
      <div className="container">
        <div className="row">
          <Loading />
        </div>
      </div>
    )
  }
  else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">
          <h4>{props.errMess}</h4>
        </div>
      </div>
    )
  }
  else if (props.dish != null) {
    return (
      <div className="container">
        <div className="row">
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to="/menu">Menu</Link>
            </BreadcrumbItem>
            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
          </Breadcrumb>
          <div className="col-12">
            {props.dish.name}
            <hr />
          </div>
          <div className="col-md-5 m-1">
            <RenderDish dish={props.dish} />
          </div>
          <div className="col-md">
            <RenderComments comments={props.comments} dishId={props.dish.id} postComment={props.postComment}/>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default DishDetail;

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

export class CommentForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
    };

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  handleSubmit(values) {
    this.toggleModal();
    this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
  }

  render() {
    return (
      <div>
        <Button outline onClick={this.toggleModal}>
          <i className="fa fa-pencil fa-lg"></i> Submit comment
        </Button>

        <div className="row row-content">
          <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
            <ModalHeader toggle={this.toggleModal}> Submit comment</ModalHeader>
            <ModalBody>
              <div className="col-12">
                <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                  <Row className="form-group">
                    <Label htmlFor="rating" md={12}>Rating</Label>
                    <Col md={12}>
                      <Control.select
                        model=".rating"
                        name="rating"
                        className="form-control"
                      >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                      </Control.select>
                    </Col>
                  </Row>

                  <Row className="form-group">
                    <Label htmlFor="author" md={12}>
                      Your name
                    </Label>
                    <Col md={12}>
                      <Control.text
                        model=".author"
                        id="author"
                        name="author"
                        placeholder="Your Name"
                        className="form-control"
                        validators={{
                          required,
                          minLength: minLength(3),
                          maxLength: maxLength(15),
                        }}
                      />
                      <Errors
                        className="text-danger"
                        model=".author"
                        show="touched"
                        messages={{
                          required: "Required",
                          minLength: "Must be greater than 3 characters",
                          maxLength: "Must be 15 charaters or less",
                        }}
                      />
                    </Col>
                  </Row>

                  <Row className="form-group">
                    <Label htmlFor="comment" md={12}>
                      Comment
                    </Label>
                    <Col md={12}>
                      <Control.textarea
                        model=".comment"
                        id="comment"
                        name="comment"
                        rows="6"
                        className="form-control"
                        validators={{ required }}
                      />
                      <Errors
                        className="text-danger"
                        model=".comment"
                        show="touched"
                        messages={{ required: "Required" }}
                      />
                    </Col>
                  </Row>

                  <Button type="submit" value="submit" color="primary">
                    Submit
                  </Button>
                </LocalForm>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  }
}
