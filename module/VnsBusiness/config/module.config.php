<?php
namespace VnsBusiness;

return array(
	'doctrine' => array(
            'driver' => array(
                __NAMESPACE__ . '_driver' => array(
                    'class' => 'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                    'cache' => 'array',
                    'paths' => array(__DIR__ . '/../src/' . __NAMESPACE__ . '/Business/Entity'),
                ),
                'orm_default' => array(
                    'drivers' => array(
                        __NAMESPACE__ . '\Business\Entity' => __NAMESPACE__ . '_driver',
                    ),
                ),
            ),
	),
);