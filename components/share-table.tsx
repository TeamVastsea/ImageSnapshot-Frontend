import React from "react";
import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from "@nextui-org/table";
import {Spinner} from "@nextui-org/react";
import { useSharedLinks } from "@/app/setting/hooks/use-shared-links";
import {Link} from "@nextui-org/link";
import {Button} from "@nextui-org/button";

export default function ShareTable({loading, list}: ReturnType<typeof useSharedLinks>) {
    console.log(list);
    return(
        <p className="text-left">
            <Table aria-label="Example static collection table"
            classNames={{
                wrapper: 'max-h-[400px]'
            }}>
                <TableHeader>
                    <TableColumn>链接</TableColumn>
                    <TableColumn>密码</TableColumn>
                    <TableColumn>有效期</TableColumn>
                    <TableColumn>下载次数</TableColumn>
                    <TableColumn>操作</TableColumn>
                </TableHeader>
                <TableBody 
                    loadingContent={<Spinner label="loading" />}
                    loadingState={loading}
                    emptyContent={"你没有上传数据"}
                    items={list == undefined ? [] : list}
                >
                    {(item) => (
                        <TableRow>
                            <TableCell><Link>{item.sid}</Link></TableCell>
                            <TableCell>{item.password}</TableCell>
                            <TableCell>{item.expiry}</TableCell>
                            <TableCell>{item.downloads}</TableCell>
                            <TableCell><Button>hello</Button></TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </p>
    )
}