import { requireAuth } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import PreviewsPage from '@/app/(admin)/previews/page';

jest.mock('@/app/lib/auth', () => ({ requireAuth: jest.fn() }));
jest.mock('@/app/lib/prisma', () => ({ prisma: { preview: { findMany: jest.fn() } } }));
afterEach(() => jest.clearAllMocks());
test('unauthenticated page rendering never queries private previews', async () => {
  jest.mocked(requireAuth).mockRejectedValueOnce(new Error('LOGIN_REDIRECT'));
  await expect(PreviewsPage()).rejects.toThrow('LOGIN_REDIRECT');
  expect(prisma.preview.findMany).not.toHaveBeenCalled();
});
test('authenticated users retain the published-preview query', async () => {
  jest.mocked(requireAuth).mockResolvedValueOnce(undefined);
  jest.mocked(prisma.preview.findMany).mockResolvedValueOnce([]);
  await PreviewsPage();
  expect(prisma.preview.findMany).toHaveBeenCalledWith({where:{isPublished:true},include:{company:true},orderBy:{createdAt:'desc'}});
});
