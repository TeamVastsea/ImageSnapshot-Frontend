'use client'

import {Card, CardBody, CardFooter} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import React, {useEffect, useState} from "react";
import {Input} from "@nextui-org/input";
import {Checkbox} from "@nextui-org/checkbox";
import {Message} from "@/components/message";
import {useRouter} from "next/navigation";
import {SetLoggedInState} from "@/interface/hooks";
import {UserAPI} from "@/interface/userAPI";
import IOC from "@/providers";
import { useCountDown, useButtonColor, useButtonMessage, useType, useIsPhone, useIsEmail } from "./hooks";

export type Colors = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
export type PageType = 'wait-check' | 'login' | 'register'

const Login = (
    props: {
        password: string;
        setPassword: (val: string)=>void
    }
) => {
    return (
     <>
         <Input
             key="password"
             type="password"
             label="密码"
             placeholder="密码"
             style={{width: 300}}
             value={props.password}
             onValueChange={props.setPassword}
         />
     </>
    )
}
const CheckCode = (props: {type: 'email' | 'phone' | 'unknown', userInput: string}) => {
    const {type} = props;
    const [loading, setLoading] = useState(true);
    const [cd, setCD] = useState(1000)
    const [time, setTime] = useCountDown(cd)
    const getCode = () => {
        if (type === 'email'){
            setLoading(true)
            IOC.user.getCheckCodeByEmail(props.userInput)
            .then((val)=>{
                setCD(val.data.cd);
            })
            .finally(()=>setLoading(false));
        }
        if (type === 'phone'){
            setLoading(true)
            IOC.user.getCheckCodeByPhone(props.userInput)
            .then((val)=>{
                setCD(val.data.cd);
            })
            .finally(()=>setLoading(false));
        }
    }
    useEffect(()=>{
        if (!time){
            setLoading(false);
        }
    },[time])
    return (
        <Button size="lg" onClick={getCode} isLoading={loading}>
            {
                loading ? 
                <span>
                    请等待 {time} 秒
                </span>
                : <span>发送验证码</span>
            }
        </Button>
    )
}
const Register = (
    props: {
        type: 'email' | 'phone' | 'unknown';
        userInput: string;
        code: string;
        userName: string,
        password: string,
        confirmPassword: string,
        setCode: (val: string)=>void;
        setPassword: (val:string)=>void,
        setUsername: (val:string)=>void,
        setConfirmPassword: (val:string)=>void,
    }
) => {
    const {code, userName,password,confirmPassword,userInput,setCode,setPassword,setUsername,setConfirmPassword} = props;
    return (
        <div className="space-y-5">
            <div className="flex gap-2 items-center">
                <Input
                    key={"code"}
                    value={code}
                    onValueChange={setCode}
                    type="text"
                    label="验证码"
                    placeholder="验证码"
                />
                <CheckCode type={props.type} userInput={userInput} />
            </div>
            <Input key="username" placeholder="用户名" label="用户名" value={userName} onValueChange={setUsername}/>
            <div className="flex space-x-3">
                <Input
                key="password"
                type="password"
                placeholder="密码"
                label="密码"
                value={password}
                onValueChange={setPassword}/>
                <Input
                    key="confirm-password"
                    type="password"
                    placeholder="确认密码"
                    label="确认密码"
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
                />
            </div>
        </div>
    );
};

export default function Page() {
    const [email, setEmail] = useState('');
    const [userInput, setUserInput] = useState('');
    const [pageType, setPageType] = useState<PageType>('wait-check');
    const {buttonMessage} = useButtonMessage(pageType, '下一步');
    const [policyState, setPolicyState] = useState(false);
    const {buttonColor} = useButtonColor(policyState);
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState('');
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const router = useRouter();
    const isPhone = useIsPhone(userInput);
    const isEmail = useIsEmail(userInput);

    const [type,setType] = useType(isPhone,isEmail)

    const handleClick = () => {
        const login = () => {
            if (!isEmail && !isPhone){
                Message.error("请输入邮箱或手机号")
            }
            UserAPI.login(email, password)
            .then((r) => {
                let [state, text] = r;
                if (state) {
                    Message.success("登录成功");
                    SetLoggedInState(true);
                    router.push("/dashboard");
                } else {
                    Message.error(text);
                }
            })
            .finally(()=>setLoading(false))
        }
        const register = ()=>{
            if (password != confirmPassword) {
                Message.error("密码输入不一致")
            }
            UserAPI.creatUser(email, password, userName, code)
            .then(r => {
                let [status, message] = r;
                if (status) {
                    Message.success("注册成功，请登录");
                    setPageType("login");
                    setEmail("");
                    setUsername("");
                    setPassword("");
                } else {
                    Message.error(message);
                }
            })
            .finally(() => setLoading(false))
        }
        const waitCheck = () => {
            if (!isEmail && !isPhone){
                Message.error("请输入邮箱或手机号")
                setLoading(false);
                return;
            }
            UserAPI.checkEmail(email)
            .then(r => {
                setPageType(r ? "login" : "register")
                if (!r) {
                    Message.message("验证码已发送")
                }
            })
            .finally(()=>setLoading(false))
        }
        return {
            login,
            register,
            'wait-check': waitCheck
        }
    }
    return (
        <div>
            <Card>
                <CardBody>
                    <div className="space-y-5">
                        <Input 
                            label="邮箱或手机号"
                            placeholder="请输入邮箱或手机号"
                            key={"emailOrPhone"}
                            isInvalid={isEmail || isPhone}
                            errorMessage={!isEmail && !isPhone && ('请输入手机或邮箱')}
                            type="text"
                            value={userInput}
                            onValueChange={setUserInput}
                            style={{width: 300}}
                        />
                        {
                            pageType !== 'wait-check' && (
                                pageType === 'login' ? <Login password={password} setPassword={setPassword} /> :
                                <Register
                                    type={type} userInput={userInput}
                                    code={code} userName={userName} password={password} confirmPassword={confirmPassword}
                                    setPassword={setPassword} setConfirmPassword={setConfirmPassword} setCode={setCode} setUsername={setUsername} />
                                )
                        }
                        <Checkbox isSelected={policyState} onValueChange={setPolicyState}>登录或注册即代表同意服务条款</Checkbox>
                    </div>
                </CardBody>
                <CardFooter className="px-5">
                    <Button
                        isLoading={loading}
                        disabled={!policyState}
                        color={buttonColor}
                        onClick={handleClick()[pageType]}
                    >
                        {buttonMessage}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
