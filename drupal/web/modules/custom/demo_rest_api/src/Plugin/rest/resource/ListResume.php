<?php

namespace Drupal\demo_rest_api\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Url;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Provides a resource to get articles.
 *
 * @RestResource(
 *   id = "list_resume",
 *   label = @Translation("List articles resource"),
 *   uri_paths = {
 *     "canonical" = "/demo_rest_api/list"
 *   }
 * )
 */
class ListResume extends ResourceBase {

    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxyInterface
     */
    protected $currentUser;

    /**
     * Default limit entities per request.
     */
    protected $limit = 4;

    /**
     * Constructs a new ListArticlesResource object.
     *
     * @param array $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed $plugin_definition
     *   The plugin implementation definition.
     * @param array $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxyInterface $current_user
     *   A current user instance.
     */
    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        AccountProxyInterface $current_user) {
        parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);

        $this->currentUser = $current_user;
    }

    /**
     * {@inheritdoc}
     */
    public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
        return new static(
            $configuration,
            $plugin_id,
            $plugin_definition,
            $container->getParameter('serializer.formats'),
            $container->get('logger.factory')->get('demo_resource'),
            $container->get('current_user')
        );
    }

    /**
     * Responds to GET requests.
     */
    public function get() {
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }

        $response = [
            'items' => [],
            'next_page' => FALSE,
            'prev_page' => FALSE,
        ];
        $request = \Drupal::request();
        $request_query = $request->query;
        $request_query_array = $request_query->all();
        $limit = $request_query->get('limit') ?: $this->limit;
        $page = $request_query->get('page') ?: 0;

        // Find out how many articles do we have.
        $query = \Drupal::entityQuery('node')->condition('type', 'resume');
        $articles_count = $query->count()->execute();
        $position = $limit * ($page + 1);
        if ($articles_count > $position) {
            $next_page_query = $request_query_array;
            $next_page_query['page'] = $page + 1;
            $response['next_page'] = Url::createFromRequest($request)
                ->setOption('query', $next_page_query)
                ->toString(TRUE)
                ->getGeneratedUrl();
        }

        if ($page > 0) {
            $prev_page_query = $request_query_array;
            $prev_page_query['page'] = $page - 1;
            $response['prev_page'] = Url::createFromRequest($request)
                ->setOption('query', $prev_page_query)
                ->toString(TRUE)
                ->getGeneratedUrl();
        }

        // Find articles.
        $query = \Drupal::entityQuery('node')
            ->condition('type', 'resume')
            ->sort('created', 'DESC')
            ->pager($limit);
        $result = $query->execute();
        $articles = \Drupal::entityTypeManager()
            ->getStorage('node')
            ->loadMultiple($result);

        /** @var \Drupal\node\Entity\Node $article */
        foreach ($articles as $article) {
            $response['items'][] = [
                'title' => $article->label(),
                'field_first_name' => "vfdvdf",
                'field_last_name'=> $article->field_last_name->value,
                'field_skills' => $article->field_skills->value,
            ];
        }

//        return new ResourceResponse($response, 200);
        return new JsonResponse($response, 200);
    }

}