import { NextApiRequest, NextApiResponse } from "next"
import { envInformation } from "../../../utils/envInfo";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const {
        query: { id, name },
        method,
    } = req;

    switch (method) {
        case 'GET':
            const response = await fetch(`${envInformation.ERPBACK_URL}api/productos/${id}`);
            const resJson = await response.json();

            res.status(response.status).json(resJson.message);
            break;

        case 'POST':
            // Update or create data in your database
            console.log(req.body);

            res.status(200).json({ id, name: name || `Producto ${id}` });
            break;

        case 'DELETE':

            break;

        default:
            res.setHeader('Allow', ['GET', 'DELETE', 'POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default handler;