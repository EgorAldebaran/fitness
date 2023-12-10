<?php

namespace App\Repository;

use App\Entity\AnketaResult;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AnketaResult>
 *
 * @method AnketaResult|null find($id, $lockMode = null, $lockVersion = null)
 * @method AnketaResult|null findOneBy(array $criteria, array $orderBy = null)
 * @method AnketaResult[]    findAll()
 * @method AnketaResult[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AnketaResultRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AnketaResult::class);
    }

//    /**
//     * @return AnketaResult[] Returns an array of AnketaResult objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('a.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?AnketaResult
//    {
//        return $this->createQueryBuilder('a')
//            ->andWhere('a.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
