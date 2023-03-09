import React, { useEffect, useState } from 'react';
import { Container, Loading, Owner, BackButton, IssuesList, PageActions, FiltersList } from './styles';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';



export default function Repositorio({ match }) {
    const [repositorio, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setpage] = useState(1);
    const [filters, setFilters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertas', active: false },
        { state: 'closed', label: 'Fechadas', active: false }
    ]);

    const [filterIndex, setFilterIndex] = useState(0);


    useEffect(() => {
        async function load() {
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }

                })
            ]);
            setRepositorio(repositorioData.data);
            setIssues(issuesData.data);
            setLoading(false);

        }

        load();

    }, [match.params.repositorio]);


    useEffect(() => {
        async function loadIssues() {
            const nomeRepo = decodeURIComponent(match.params.repositorio);

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page: page,
                    per_page: 5
                },
            });

            setIssues(response.data);

        }
        loadIssues();

    }, [filters, filterIndex, page])


    function handlePages(actions) {
        setpage(actions === 'back' ? page - 1 : page + 1)
    }

    function handleFilter(index) {
        setFilterIndex(index);
    }


    if (loading) {
        return (
            <Loading>
                <h1>Carregando..</h1>
            </Loading>

        );
    }

    return (
        <Container>

            <BackButton to={'/'}>
                <FaArrowLeft color='#000' size={30} />
            </BackButton>

            <Owner>
                <img src={repositorio.owner.avatar_url} alt='avatar' />
                <h1>{repositorio.name}</h1>
                <p>{repositorio.description}</p>
            </Owner>

            <FiltersList active={filterIndex}>

                {filters.map((filter, index) => (
                    <button
                        type='button'
                        key={filter.label}
                        onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>

                ))}
            </FiltersList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt='Owner issue' />

                        <div>
                            <strong>
                                <a href={issue.html_url}>
                                    {issue.title}
                                </a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}

                            </strong>

                            <p>{issue.user.login}</p>
                        </div>
                    </li>

                ))}

            </IssuesList>

            <PageActions>
                <button
                    type='button'
                    onClick={() => handlePages('back')}
                    disabled={page === 1}
                >
                    Voltar
                </button>

                <button type='button' onClick={() => handlePages('next')}>
                    Próxima
                </button>
            </PageActions>

        </Container>
    )
}
