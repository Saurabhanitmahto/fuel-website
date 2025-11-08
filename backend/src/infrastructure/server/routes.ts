import { Router } from 'express';
import prisma from '../db/prismaClient';

// Repositories
import { RouteRepositoryImpl } from '../../adapters/outbound/postgres/RouteRepositoryImpl';
import { ComplianceRepositoryImpl } from '../../adapters/outbound/postgres/ComplianceRepositoryImpl';
import { BankingRepositoryImpl } from '../../adapters/outbound/postgres/BankingRepositoryImpl';
import { PoolRepositoryImpl } from '../../adapters/outbound/postgres/PoolRepositoryImpl';

// Use Cases
import { CompareRoutesUseCase } from '../../core/application/CompareRoutesUseCase';
import { ComputeCBUseCase } from '../../core/application/ComputeCBUseCase';
import { BankingUseCase } from '../../core/application/BankingUseCase';
import { PoolingUseCase } from '../../core/application/PoolingUseCase';

// Controllers
import { RoutesController } from '../../adapters/inbound/http/routesController';
import { ComplianceController } from '../../adapters/inbound/http/complianceController';
import { BankingController } from '../../adapters/inbound/http/bankingController';
import { PoolsController } from '../../adapters/inbound/http/poolsController';

// Initialize repositories
const routeRepo = new RouteRepositoryImpl(prisma);
const complianceRepo = new ComplianceRepositoryImpl(prisma);
const bankingRepo = new BankingRepositoryImpl(prisma);
const poolRepo = new PoolRepositoryImpl(prisma);

// Initialize use cases
const compareRoutesUseCase = new CompareRoutesUseCase(routeRepo);
const computeCBUseCase = new ComputeCBUseCase(complianceRepo, bankingRepo);
const bankingUseCase = new BankingUseCase(bankingRepo, complianceRepo);
const poolingUseCase = new PoolingUseCase(poolRepo, complianceRepo);

// Initialize controllers
const routesController = new RoutesController(routeRepo, compareRoutesUseCase);
const complianceController = new ComplianceController(computeCBUseCase);
const bankingController = new BankingController(bankingUseCase);
const poolsController = new PoolsController(poolingUseCase);

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes endpoints
router.get('/routes', routesController.getRoutes);
router.post('/routes/:routeId/baseline', routesController.setBaseline);
router.get('/routes/comparison', routesController.getComparison);

// Compliance endpoints
router.post('/compliance/cb', complianceController.computeCB);
router.get('/compliance/adjusted-cb', complianceController.getAdjustedCB);

// Banking endpoints
router.post('/banking/bank', bankingController.bank);
router.post('/banking/apply', bankingController.apply);
router.get('/banking/records', bankingController.getRecords);

// Pooling endpoints
router.post('/pools', poolsController.createPool);
router.get('/pools', poolsController.getPoolsByYear);

export default router;