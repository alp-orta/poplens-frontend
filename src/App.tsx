import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form, Row, Col, Input } from 'antd';

function App() {

    const inputonchange = (e: any) => {
        console.log(e.value)
    }

    return (
        <>
        <Form 
            name={"appform"}
        >
            <Row gutter={16} align={"middle"}>
                <Col id={"col"} xs={8} md={8} xl={8}>
                    <Form.Item name={"button"}>
                        <Input size='large' type='primary'></Input>
                    </Form.Item>
                </Col>
                <Col id={"col1"} xs={8} md={8} xl={8}>
                    <Form.Item name={"button1"}>
                        <Input onChange={inputonchange} size='large' type='primary'></Input>
                    </Form.Item>
                </Col>
                <Col id={"col2"} xs={8} md={8} xl={8}>
                    <Form.Item name={"button2"}>
                        <Input size='large' type='primary'></Input>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        </>
    );
}

export default App;
