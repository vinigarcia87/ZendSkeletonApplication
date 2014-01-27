<?php
namespace VnsExperimental;

return array(
    'controllers' => array(
        'invokables' => array(
            'VnsExperimental\Controller\Index' => 'VnsExperimental\Controller\IndexController',
            'pdf'                              => 'VnsExperimental\Controller\PdfController',
            'excel'                            => 'VnsExperimental\Controller\ExcelController',
            'twtform'                          => 'VnsExperimental\Controller\TwtFormController',
            'twtmodule'                        => 'VnsExperimental\Controller\TwtModuleController',
            'doctrine'                         => 'VnsExperimental\Controller\DoctrineController',
            'css-tricks'                       => 'VnsExperimental\Controller\CssTricksController',
            'estilo'                           => 'VnsExperimental\Controller\EstiloController',
            'tabela'                           => 'VnsExperimental\Controller\TabelaController',
            'form'                             => 'VnsExperimental\Controller\FormController',
        ),
    ),

    'router' => array(
        'routes' => array(
            'vnsexperimental' => array(
                'type' => 'Segment',
                'options' => array(
                    'route'    => '/vnsexperimental[/[:controller[/[:action]]]]',
                    'constraints' => array(
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'         => '[0-9]+',
                    ),
                    'defaults' => array(
                        'controller' => 'VnsExperimental\Controller\Index',
                        'action'     => 'index',
                    ),
                ),
            ),
        ),
    ),

    'view_manager' => array(
        'template_path_stack' => array(
            __DIR__ . '/../view'
        ),
        'strategies' => array(
            'ViewJsonStrategy',
        ),
    ),
		
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