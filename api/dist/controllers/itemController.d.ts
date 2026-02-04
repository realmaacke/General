import { type Request, type Response, type NextFunction } from "express";
export declare const createItem: (req: Request<ItemParams>, res: Response, next: NextFunction) => void;
export declare const getItems: (req: Request, res: Response, next: NextFunction) => void;
type ItemParams = {
    id: string;
};
export declare const getItemById: (req: Request<ItemParams>, res: Response, next: NextFunction) => void;
export declare const updateItem: (req: Request<ItemParams>, res: Response, next: NextFunction) => void;
export declare const deleteItem: (req: Request<ItemParams>, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=itemController.d.ts.map