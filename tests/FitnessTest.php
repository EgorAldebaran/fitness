<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use App\Entity\Guest;
use App\Entity\AnketaResult;

class FitnessTest extends KernelTestCase
{
    /**
    * @var Guest
    */
    protected $doctrine;

    public function setUp(): void
    {
        static::bootKernel();
        $this->doctrine = static::$kernel->getContainer()->get('doctrine')->getManager();
    }
    
    //// имитация регистрации гостя
    public function testRegistrationGuest()
    {
        $guest = new Guest;
        $guest->setFname('jacke');
        $guest->setLname('Diamonds');
        $guest->setPhone('848484884');
        $guest->setEmail('some@gmail.com');

        $result_anketa = new AnketaResult;
        $result_anketa->setQuestion('your favorite icecream?');
        $result_anketa->setResponse('ananas');

        $result_anketa->setGuest($guest);

        $this->doctrine->persist($result_anketa);
        $this->doctrine->persist($guest);
        $this->doctrine->flush();

        $this->assertTrue(true);
    }
}
