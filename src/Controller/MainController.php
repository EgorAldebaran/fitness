<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\UserService;

class MainController extends AbstractController
{
    /**
    * @var User
    */
    protected $user;

    public function __construct(UserService $userService)
    {
        $this->user = $userService->getInstance();
    }
    
    #[Route('/', name: 'app_main')]
    public function index(): Response
    {
        return $this->render('frontend/index.html.twig', []);
    }

    #[Route('/registration', name: 'registration')]
    public function registration(Request $request, EntityManagerInterface $entityManager, UserService $users): Response
    {
        return $this->render('frontend/registration.html.twig', []);
    }

    #[Route('/signin', name: 'signin')]
    public function signin(UserService $users, EntityManagerInterface $entityManager, Request $request): Response
    {
        if ($request->request->get('email')) {
            return new Response('isset ok');
        }
        return new Response('duck you');
        
        $this->user->setEmail('first@gmail.com');
        $this->user->setPassword('123password');
        $this->user->setRoles(['ADMIN']);

        $entityManager->persist($this->user);
        //$entityManager->flush();

        return new Response('---successor---');
    }
}
