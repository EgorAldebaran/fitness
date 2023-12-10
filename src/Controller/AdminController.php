<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Guest;

class AdminController extends AbstractController
{
    #[Route('/admin/main', name: 'app_admin')]
    public function index(): Response
    {
        return $this->render('admin.html.twig', [
           
        ]);
    }

    #[Route('/admin/client', name: 'admin_client')]
    public function client(EntityManagerInterface $entityManager): Response
    {
        $clients = $entityManager->getRepository(Guest::class)->findAll();
        
        return $this->render('admin/client.html.twig', [
            'clients' => $clients,
        ]);
    }
}
