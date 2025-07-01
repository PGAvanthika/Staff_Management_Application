import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

const TaskDetails = ({
  task,
  showSubmit = false,
  showExtend = false,
  showApprove = false,
  showDecline = false,
  onAction,
  onExtendClick,
}) => {
  const handleSubmit = () => {
    alert("Submitted successfully!");
    if (onAction) onAction();
  };

  const handleApprove = () => {
    alert("Approved!");
    if (onAction) onAction();
  };

  const handleDecline = () => {
    alert("Oops. The submission has been declined.");
    if (onAction) onAction();
  };

  const handleExtend = () => {
    if (onExtendClick) onExtendClick(task);
  };

  const deadline = new Date(task.dueDate);
  const now = new Date();
  const isWithin24Hours = (deadline - now) / (1000 * 60 * 60) <= 24;

  return (
    <Container className="p-4 bg-info bg-opacity-25 rounded" style={{ maxWidth: "900px" }}>
      <Row className="mb-3">
        <Col><Card body className="bg-light text-center fw-bold">{task.task}</Card></Col>
        <Col><Card body className="bg-light text-center fw-bold">{task.project}</Card></Col>
      </Row>

      <Row className="mb-3">
        <Col><Card body className="bg-light text-center fw-bold">{task.label}</Card></Col>
        <Col><Card body className="bg-light text-center fw-bold">{new Date(task.dueDate).toLocaleString()}</Card></Col>
      </Row>

      <Row className="mb-4">
        <Col><Card body className="bg-light text-center fw-bold">{task.description}</Card></Col>
      </Row>

      <Row className="justify-content-end">
        {showExtend && (
          <Col xs="auto">
            <Button variant="danger" onClick={handleExtend}>Extend Deadline</Button>
          </Col>
        )}
        {showDecline && (
          <Col xs="auto">
            <Button variant="danger" onClick={handleDecline}>Decline</Button>
          </Col>
        )}
        {showSubmit && (
          <Col xs="auto">
            <Button variant="secondary" onClick={handleSubmit}>Submit</Button>
          </Col>
        )}
        {showApprove && (
          <Col xs="auto">
            <Button variant="secondary" onClick={handleApprove}>Approve</Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default TaskDetails;
