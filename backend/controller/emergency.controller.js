import { request, response } from "express";
import initPrisma from "../dbinit.js";

const prisma = await initPrisma();

export const emergencyGet = async (req = request, res = response) => {
    try {
        let role = ["admin","Doctor"]
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        let filter = []
        if(req.body){
            let {alert_id, code_type, timestamp, status, departmentId,departmentName} = req.body
            filter = [
                alert_id ? {alert_id} : undefined,
                code_type ? {code_type} : undefined,
                timestamp ? {timestamp} : undefined,
                status ? {status} : undefined,
                departmentName ? { department: { department_name: departmentName } } : undefined,
                departmentId ? {departmentId} : undefined
            ].filter(Boolean)
        }
        let data = await prisma.emergency_alert.findMany(
            filter.length > 0 ? 
            {where:{OR:filter},include:{department:true}} :
             {include:{department:true}}
            );
        res.status(200).json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error" });
    }
};

export const emergencyAdd = async (req = request, res = response) => {
    try {
        let role = ["admin","Doctor"]
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        let { code_type, timestamp, departmentId,status  } = req.body;
        await prisma.emergency_alert.create({
            data: {
                code_type,
                timestamp,
                department: {
                    connect: {
                        dept_id: departmentId,
                    },
                },
                status,
            },
        });
        res.status(200).json({ message: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error" });
    }
}

export const emergencyDelete = async (req = request, res = response) => {
    try {
        let role = ["admin","Doctor"]
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        let { alert_id, code_type, timestamp, status, departmentId } = req.body;
        await prisma.emergency_alert.deleteMany({
            where: {
                OR: [
                    alert_id ? { alert_id } : undefined,
                    code_type ? { code_type } : undefined,
                    timestamp ? { timestamp } : undefined,
                    status ? { status } : undefined,
                    departmentId ? { departmentId } : undefined
                ].filter(Boolean)
            }
        });
        res.status(200).json({ message: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error" });
    }
}

export const emergencyUpdate = async (req = request, res = response) => {
    try {
        let role = ["admin","Doctor"]
        if (!role.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        let { alert_id, code_type, timestamp, status, departmentId } = req.body;
        let update = {}
        if(code_type !== undefined) update.code_type = code_type;
        if(timestamp !== undefined) update.timestamp = timestamp;
        if(status !== undefined) update.status = status;
        if(departmentId !== undefined) update.departmentId = departmentId;
        await prisma.emergency_alert.update({
            where: {
                alert_id
            },
            data: update
        });
        res.status(200).json({ message: "success" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "error" });
    }
}