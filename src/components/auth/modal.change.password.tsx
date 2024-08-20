'use client'

import { useHasMounted } from "@/utils/customHook";
import { Button, Form, Input, Modal, notification, Steps, Statistic, message, Row, Col } from "antd";
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import type { GetProps } from 'antd';
import { sendRequest } from "@/utils/api";
import { useState } from "react";
const { Countdown } = Statistic;
import dayjs from 'dayjs';

import '@/components/auth/styles.scss'



const ModalChangePassword = (props: any) => {
    type OTPProps = GetProps<typeof Input.OTP>;

    const { isModalOpen, setIsModalOpen } = props;
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [valueCode, setValueCode] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const deadline = dayjs().add(5, 'minute').toDate().getTime();

    const hasMounted = useHasMounted();

    const onChange: OTPProps['onChange'] = (text) => {
        setValueCode(text)
    };

    const sharedProps: OTPProps = {
        onChange,
    };


    if (!hasMounted) return <></>;

    const onFinish = () => {
        // message.success('Countdown finished!');
    };

    const onFinishStep0 = async (values: any) => {
        const { email } = values;
        setUserEmail(email);

        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-password`,
            method: "POST",
            body: {
                email,
            }
        })

        if (res?.data) {
            setCurrent(1);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    const onFinishStep1 = async (values: any) => {
        const { code, password, confirmPassword } = values;
        console.log(code, password, confirmPassword);

        if (password !== confirmPassword) {
            notification.error({
                message: "Invalid input",
                description: "Mật khẩu và xác nhận mật khẩu không chính xác"
            })
            return;
        }
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/change-password`,
            method: "POST",
            body: {
                email: userEmail, code, password, confirmPassword
            }
        })

        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }

    }

    const handleCancel = () => {
        setIsModalOpen(false);
        setUserEmail('');
        setCurrent(0);
        form.resetFields();
    }
    return (
        <>
            <Modal
                title="Quên mật khẩu"
                open={isModalOpen}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(handleCancel)}
                maskClosable={false}
                footer={null}
            >
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Email',
                            // status: 'finish',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            // status: 'finish',
                            icon: <SolutionOutlined />,
                        },

                        {
                            title: 'Done',
                            // status: 'wait',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current === 0 &&
                    <>

                        <div style={{ margin: "20px 0" }}>
                            <p>Để thực hiện thay đổi mật khẩu, vui lòng nhập email tài khoản của bạn.</p>
                        </div>
                        <Form
                            name="change-password"
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                            form={form}
                        >
                            <Form.Item
                                label=""
                                name="email"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 1 &&
                    <>
                        <div style={{ margin: "20px 0" }}>
                            <p>Vui lòng thực hiện đổi mật khẩu</p>
                        </div>

                        <Form
                            name="change-pass-2"
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'

                        >
                            <Form.Item
                                label={
                                    <Row justify="space-between" align="middle">
                                        <Col>Code</Col>
                                        <Col>
                                            <Countdown className="custom-countdown" value={deadline} onFinish={onFinish} style={{ display: 'flex', marginLeft: '4px' }} />
                                        </Col>
                                    </Row>
                                }
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your code!',
                                    },
                                ]}
                            >
                                <Input.OTP variant="filled" {...sharedProps} length={4} />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu mới"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Xác nhận mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your new password!',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Confirm
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                }

                {current === 2 &&
                    <div style={{ margin: "20px 0" }}>
                        <p>Tải khoản của bạn đã được thay đổi mật khẩu thành công. Vui lòng đăng nhập lại</p>
                    </div>
                }
            </Modal>
        </>
    )
}

export default ModalChangePassword;