import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, Form, Row, Col, Input } from 'antd';
import axios from 'axios';

function App() {

    const api = axios.create({
        baseURL: "https://localhost:7137/", // WebUI Gateway URL
      });

    api.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    }, (error) => {
    return Promise.reject(error);
    });

    // Example function to register a user
    const registerUser = async (user: any) => {
        try {
            const response = await api.post('UserAuthentication/Register', user); 
            console.log('User registered successfully:', response.data);
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

    // Example function to login a user
    const loginUser = async (user: any) => {
        try {
            const response = await api.post('UserAuthentication/Login', user); 
            const token = response.data.token; 
            localStorage.setItem("jwtToken", token);
            console.log('User logined successfully:', response.data);
        } catch (error) {
            console.error('There was a problem with the request:', error);
        }
    }

    const newUser = {
        UserName: 'john_doe',
        Email: "a@a.csom",
        Password: 'securepassword123A*'
    };

    const loginInfo = {
        UserName: 'john_doe',
        Password: 'securepassword123A*'
    };

    return (
        <>
        <Form 
            name={"appform"}
        >
            <Row gutter={16} align={"middle"}>
                <Col id={"col"} xs={8} md={8} xl={8}>
                    <Form.Item name={"button"}>
                        <Button type='primary' onClick={() => registerUser(newUser)}>register</Button>
                    </Form.Item>
                </Col>
                <Col id={"col2"} xs={8} md={8} xl={8}>
                <Form.Item name={"button2"}>
                    <Button type='primary' onClick={() => loginUser(loginInfo)}>login</Button>
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
