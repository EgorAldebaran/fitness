<?php  

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AdminClientController extends AbstractController
{
    #[Route('/admin/client/create/', name: 'client_create')]
    public function create(EntityManagerInterface $entityManager): Response
    {
        dd ('something else');
    }
}
