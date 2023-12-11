<?php  

namespace App\Service;

use App\Entity\User;

class UserService
{
    public function getInstance(): ?User
    {
        $instance = new User;
        return $instance;
    }
}
